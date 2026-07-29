import type { Context } from 'hono';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
import { env } from '../../../config/env';
import type { AppVariables } from '../types/auth.types';
import {
  ACCESS_COOKIE_NAME,
  OAUTH_STATE_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
  accessTokenMaxAge,
  createAccessToken,
  createOAuthState,
  createRefreshToken,
  oauthStateMaxAge,
  refreshTokenMaxAge,
  verifyOAuthState,
  verifyRefreshToken,
} from '../tokens/jwt';
import {
  buildAuthorizeUrl,
  callbackUrl,
  exchangeCodeForToken,
  fetchOAuthUser,
  generatePkce,
  isProvider,
  isProviderConfigured,
  type Provider,
} from '../oauth/oauth';
import {
  findOrCreateUser,
  findRefreshToken,
  findUserById,
  revokeRefreshToken,
  storeRefreshToken,
} from '../services/auth.service';

function setAuthCookies(
  c: Context,
  accessToken: string,
  refreshToken: string,
  refreshTokenMaxAgeSeconds: number,
) {
  const secure = env.isProd;
  const sameSite = env.isProd ? 'None' : 'Lax';
  const domain = env.cookieDomain || undefined;
  setCookie(c, ACCESS_COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure,
    sameSite,
    path: '/',
    domain,
    maxAge: accessTokenMaxAge(),
  });
  setCookie(c, REFRESH_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure,
    sameSite,
    path: '/',
    domain,
    maxAge: refreshTokenMaxAgeSeconds,
  });
}

function clearAuthCookies(c: Context) {
  const domain = env.cookieDomain || undefined;

  deleteCookie(c, ACCESS_COOKIE_NAME, {
    path: '/',
    domain,
  });

  deleteCookie(c, REFRESH_COOKIE_NAME, {
    path: '/',
    domain,
  });
}

export function getProviderAvailability(c: Context) {
  const google = isProviderConfigured('google');
  const github = isProviderConfigured('github');
  return c.json({ google, github });
}

export async function startAuth(c: Context) {
  const provider = c.req.param('provider');
  if (!isProvider(provider)) {
    return c.json({ error: 'Unsupported provider' }, 400);
  }
  if (!isProviderConfigured(provider)) {
    return c.json({ error: `Provider "${provider}" is not configured` }, 500);
  }

  const pkce = provider === 'google' ? await generatePkce() : undefined;
  const state = await createOAuthState(provider, pkce?.verifier);

  setCookie(c, OAUTH_STATE_COOKIE_NAME, state, {
    httpOnly: true,
    secure: env.isProd,
    sameSite: env.isProd ? 'None' : 'Lax',
    path: '/',
    domain: env.cookieDomain || undefined,
    maxAge: oauthStateMaxAge(),
  });

  const url = await buildAuthorizeUrl(provider, state, pkce);
  return c.redirect(url, 302);
}

export async function handleCallback(c: Context) {
  const provider = c.req.param('provider');
  if (!isProvider(provider)) {
    return c.json({ error: 'Unsupported provider' }, 400);
  }

  const stateParam = c.req.query('state') ?? '';
  const stateCookie = getCookie(c, OAUTH_STATE_COOKIE_NAME) ?? '';
  deleteCookie(c, OAUTH_STATE_COOKIE_NAME, {
    path: '/',
    domain: env.cookieDomain || undefined,
  });

  if (!stateCookie || stateParam !== stateCookie) {
    return c.redirect(`${env.webUrl}/auth?auth=error&reason=invalid_state`, 302);
  }

  const oauthState = await verifyOAuthState(stateParam);
  if (!oauthState || oauthState.provider !== provider) {
    return c.redirect(`${env.webUrl}/auth?auth=error&reason=invalid_state`, 302);
  }

  const code = c.req.query('code') ?? '';
  if (!code) {
    return c.redirect(`${env.webUrl}/auth?auth=error&reason=no_code`, 302);
  }

  try {
    const { accessToken } = await exchangeCodeForToken(
      provider,
      code,
      oauthState.verifier || undefined,
    );
    const userInfo = await fetchOAuthUser(provider, accessToken);
    const user = await findOrCreateUser({
      provider,
      providerId: userInfo.providerId,
      email: userInfo.email,
      name: userInfo.name,
      avatar: userInfo.avatar,
    });

    const access = await createAccessToken(user);
    const jti = crypto.randomUUID();
    const refresh = await createRefreshToken({ id: user.id, jti });
    await storeRefreshToken({
      jti,
      userId: user.id,
      expiresAt: new Date(Date.now() + refreshTokenMaxAge() * 1000),
    });

    setAuthCookies(c, access, refresh, refreshTokenMaxAge());
    return c.redirect(`${env.webUrl}/chat`, 302);
  } catch (err) {
    console.error('[oauth] callback failed:', err);
    return c.redirect(`${env.webUrl}/auth?auth=error&reason=exchange_failed`, 302);
  }
}

export async function refreshTokens(c: Context) {
  const refreshToken = getCookie(c, REFRESH_COOKIE_NAME) ?? '';
  if (!refreshToken) {
    return c.json({ error: 'No refresh token' }, 401);
  }

  const payload = await verifyRefreshToken(refreshToken);
  if (!payload) {
    clearAuthCookies(c);
    return c.json({ error: 'Invalid refresh token' }, 401);
  }

  const stored = await findRefreshToken(payload.jti);
  if (!stored || stored.revokedAt !== null || stored.expiresAt < new Date()) {
    clearAuthCookies(c);
    return c.json({ error: 'Refresh token revoked or expired' }, 401);
  }

  const user = await findUserById(Number(payload.sub));
  if (!user) {
    clearAuthCookies(c);
    return c.json({ error: 'User not found' }, 401);
  }

  await revokeRefreshToken(payload.jti);

  const newJti = crypto.randomUUID();
  const newRefresh = await createRefreshToken({ id: user.id, jti: newJti });
  await storeRefreshToken({
    jti: newJti,
    userId: user.id,
    expiresAt: new Date(Date.now() + refreshTokenMaxAge() * 1000),
  });
  const newAccess = await createAccessToken(user);

  setAuthCookies(c, newAccess, newRefresh, refreshTokenMaxAge());
  return c.json({
    user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar },
  });
}

export async function getCurrentUser(c: Context) {
  const auth = c.get('authUser');
  const user = await findUserById(Number(auth.sub));
  if (!user) {
    clearAuthCookies(c);
    return c.json({ error: 'User not found' }, 401);
  }
  return c.json({ user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar } });
}

export async function logout(c: Context) {
  const refreshToken = getCookie(c, REFRESH_COOKIE_NAME) ?? '';
  if (refreshToken) {
    const payload = await verifyRefreshToken(refreshToken);
    if (payload) {
      await revokeRefreshToken(payload.jti).catch(() => {});
    }
  }
  clearAuthCookies(c);
  return c.json({ ok: true });
}

export { callbackUrl };
