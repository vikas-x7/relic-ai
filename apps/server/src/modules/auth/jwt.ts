import { sign, verify } from 'hono/jwt'
import { env } from '../../config/env'
import type { Provider } from './oauth'

const JWT_ALG = 'HS256'

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

function nowInSeconds(): number {
  return Math.floor(Date.now() / 1000)
}

export function accessTokenMaxAge(): number {
  return env.jwt.accessExpiresIn
}

export function refreshTokenMaxAge(): number {
  return env.jwt.refreshExpiresIn
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
    { ...payload, exp: nowInSeconds() + env.jwt.accessExpiresIn },
    env.jwt.accessSecret,
    JWT_ALG,
  )
}

export async function verifyAccessToken(
  token: string,
): Promise<AccessPayload | null> {
  try {
    const payload = await verify(token, env.jwt.accessSecret, JWT_ALG)
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
  const expiresAt = new Date(Date.now() + env.jwt.refreshExpiresIn * 1000)
  const payload: RefreshPayload = {
    type: 'refresh',
    sub: String(user.id),
    jti,
  }
  return {
    token: await sign(
      { ...payload, exp: Math.floor(expiresAt.getTime() / 1000) },
      env.jwt.refreshSecret,
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
    const payload = await verify(token, env.jwt.refreshSecret, JWT_ALG)
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
    { ...payload, exp: nowInSeconds() + env.jwt.stateExpiresIn },
    env.jwt.accessSecret,
    JWT_ALG,
  )
}

export async function verifyOAuthState(
  token: string,
  provider: Provider,
): Promise<OAuthStatePayload | null> {
  try {
    const payload = await verify(token, env.jwt.accessSecret, JWT_ALG)
    if (payload.type !== 'oauth-state' || payload.provider !== provider) {
      return null
    }
    return payload as unknown as OAuthStatePayload
  } catch {
    return null
  }
}
