import { sign, verify } from 'hono/jwt'
import { env } from '../../config/env'
import type { Provider } from './oauth'

const JWT_ALG = 'HS256'
const ACCESS_TTL_SECONDS = 60 * 15
const REFRESH_TTL_SECONDS = 60 * 60 * 24 * 7
const STATE_TTL_SECONDS = 60 * 10

export const ACCESS_COOKIE_NAME = 'relic_access_token'
export const REFRESH_COOKIE_NAME = 'relic_refresh_token'
export const OAUTH_STATE_COOKIE_NAME = 'relic_oauth_state'

export interface AccessPayload {
  type: 'access'
  sub: string
  email: string
  name: string | null
}

export interface RefreshPayload {
  type: 'refresh'
  sub: string
  jti: string
}

export interface OAuthStatePayload {
  type: 'oauth-state'
  provider: Provider
  nonce: string
  verifier: string
}

export function accessTokenMaxAge(): number {
  return ACCESS_TTL_SECONDS
}

export function refreshTokenMaxAge(): number {
  return REFRESH_TTL_SECONDS
}

export async function createAccessToken(user: {
  id: number
  email: string
  name: string | null
}): Promise<string> {
  const payload: AccessPayload = {
    type: 'access',
    sub: String(user.id),
    email: user.email,
    name: user.name,
  }
  return sign(
    { ...payload, exp: Math.floor(Date.now() / 1000) + ACCESS_TTL_SECONDS },
    env.jwtSecret,
    JWT_ALG,
  )
}

export async function verifyAccessToken(
  token: string,
): Promise<AccessPayload | null> {
  try {
    const payload = await verify(token, env.jwtSecret, JWT_ALG)
    return payload.type === 'access' ? (payload as unknown as AccessPayload) : null
  } catch {
    return null
  }
}

export async function createRefreshToken(user: {
  id: number
  email: string
  name: string | null
}): Promise<{ token: string; jti: string; expiresAt: Date }> {
  const jti = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + REFRESH_TTL_SECONDS * 1000)
  const payload: RefreshPayload = {
    type: 'refresh',
    sub: String(user.id),
    jti,
  }
  return {
    token: await sign(
      { ...payload, exp: Math.floor(expiresAt.getTime() / 1000) },
      env.jwtSecret,
      JWT_ALG,
    ),
    jti,
    expiresAt,
  }
}

export async function verifyRefreshToken(
  token: string,
): Promise<RefreshPayload | null> {
  try {
    const payload = await verify(token, env.jwtSecret, JWT_ALG)
    return payload.type === 'refresh' ? (payload as unknown as RefreshPayload) : null
  } catch {
    return null
  }
}

export async function createOAuthState(
  provider: Provider,
  verifier: string,
): Promise<string> {
  const payload: OAuthStatePayload = {
    type: 'oauth-state',
    provider,
    nonce: crypto.randomUUID(),
    verifier,
  }
  return sign(
    { ...payload, exp: Math.floor(Date.now() / 1000) + STATE_TTL_SECONDS },
    env.jwtSecret,
    JWT_ALG,
  )
}

export async function verifyOAuthState(
  token: string,
  provider: Provider,
): Promise<OAuthStatePayload | null> {
  try {
    const payload = await verify(token, env.jwtSecret, JWT_ALG)
    if (payload.type !== 'oauth-state' || payload.provider !== provider) {
      return null
    }
    return payload as unknown as OAuthStatePayload
  } catch {
    return null
  }
}
