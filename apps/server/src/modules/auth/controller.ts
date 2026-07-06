import type { Context } from 'hono'
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'
import { env } from '../../config/env'
import {
  ACCESS_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
  OAUTH_STATE_COOKIE_NAME,
  accessTokenMaxAge,
  createAccessToken,
  createOAuthState,
  createRefreshToken,
  refreshTokenMaxAge,
  verifyOAuthState,
  verifyRefreshToken,
} from './jwt'
import {
  buildAuthorizeUrl,
  exchangeCodeForToken,
  fetchOAuthUser,
  generatePkce,
  isProvider,
  isProviderConfigured,
} from './oauth'
import {
  findOrCreateUser,
  findRefreshToken,
  revokeRefreshToken,
  storeRefreshToken,
} from './service'

function cookieOptions() {
  return {
    httpOnly: true,
    secure: env.isProd,
    sameSite: 'lax' as const,
    path: '/',
  }
}

function setAuthCookies(
  c: Context,
  accessToken: string,
  refreshToken: string,
) {
  setCookie(c, ACCESS_COOKIE_NAME, accessToken, {
    ...cookieOptions(),
    maxAge: accessTokenMaxAge(),
  })
  setCookie(c, REFRESH_COOKIE_NAME, refreshToken, {
    ...cookieOptions(),
    maxAge: refreshTokenMaxAge(),
  })
}

function clearAuthCookies(c: Context) {
  deleteCookie(c, ACCESS_COOKIE_NAME, cookieOptions())
  deleteCookie(c, REFRESH_COOKIE_NAME, cookieOptions())
}

export async function startAuth(c: Context) {
  const providerParam = c.req.param('provider')
  if (!providerParam || !isProvider(providerParam)) {
    return c.text('Unsupported provider', 400)
  }
  if (!isProviderConfigured(providerParam)) {
    return c.text(`Provider "${providerParam}" is not configured`, 500)
  }

  const pkce = generatePkce()
  const state = await createOAuthState(providerParam, pkce.verifier)

  setCookie(c, OAUTH_STATE_COOKIE_NAME, state, {
    ...cookieOptions(),
    maxAge: env.jwt.stateExpiresIn,
  })

  const url = buildAuthorizeUrl(providerParam, state, pkce)
  return c.redirect(url)
}

export async function handleCallback(c: Context) {
  const provider = c.req.param('provider')
  if (!provider || !isProvider(provider)) {
    return c.text('Unsupported provider', 400)
  }

  const code = c.req.query('code')
  const state = c.req.query('state')
  const stateCookie = getCookie(c, OAUTH_STATE_COOKIE_NAME)

  if (!code || !state || !stateCookie) {
    return c.text('Missing OAuth parameters', 400)
  }
  if (state !== stateCookie) {
    return c.text('State mismatch', 400)
  }

  const oauthState = await verifyOAuthState(state, provider)
  if (!oauthState) {
    return c.text('Invalid or expired state', 400)
  }

  try {
    const { accessToken } = await exchangeCodeForToken(
      provider,
      code,
      oauthState.verifier,
    )
    const oauthUser = await fetchOAuthUser(provider, accessToken)
    const user = await findOrCreateUser(oauthUser)

    const access = await createAccessToken(user)
    const refresh = await createRefreshToken(user)
    await storeRefreshToken({
      jti: refresh.jti,
      userId: user.id,
      expiresAt: refresh.expiresAt,
    })

    deleteCookie(c, OAUTH_STATE_COOKIE_NAME, cookieOptions())
    setAuthCookies(c, access, refresh.token)

    return c.redirect(env.webUrl)
  } catch (error) {
    console.error(`[auth] ${provider} callback failed:`, error)
    return c.text('Authentication failed', 500)
  }
}

export async function refreshTokens(c: Context) {
  const token = getCookie(c, REFRESH_COOKIE_NAME)
  if (!token) {
    return c.json({ error: 'No refresh token' }, 401)
  }

  const payload = await verifyRefreshToken(token)
  if (!payload) {
    clearAuthCookies(c)
    return c.json({ error: 'Invalid refresh token' }, 401)
  }

  const stored = await findRefreshToken(payload.jti)
  if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
    clearAuthCookies(c)
    return c.json({ error: 'Refresh token revoked or expired' }, 401)
  }

  await revokeRefreshToken(payload.jti)

  const user = stored.user
  const authUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
  }
  const access = await createAccessToken(authUser)
  const refresh = await createRefreshToken(authUser)
  await storeRefreshToken({
    jti: refresh.jti,
    userId: user.id,
    expiresAt: refresh.expiresAt,
  })

  setAuthCookies(c, access, refresh.token)
  return c.json({ ok: true })
}

export async function getCurrentUser(c: Context) {
  const session = c.get('authUser')
  return c.json({
    id: Number(session.sub),
    email: session.email,
    name: session.name,
  })
}

export async function logout(c: Context) {
  const token = getCookie(c, REFRESH_COOKIE_NAME)
  if (token) {
    const payload = await verifyRefreshToken(token)
    if (payload) {
      await revokeRefreshToken(payload.jti).catch(() => {
        // token pehle se revoked ho to ignore
      })
    }
  }
  clearAuthCookies(c)
  return c.json({ ok: true })
}

export function getProviderAvailability() {
  return Object.fromEntries(
    (['google', 'github'] as const).map((p) => [p, isProviderConfigured(p)]),
  ) as Record<'google' | 'github', boolean>
}
