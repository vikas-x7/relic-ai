import { sign, verify } from 'hono/jwt';
import { env } from '../../../config/env';
import type { Provider } from '../oauth/oauth';

const JWT_ALG = 'HS256';

export const ACCESS_COOKIE_NAME = 'relic_access_token';
export const REFRESH_COOKIE_NAME = 'relic_refresh_token';
export const OAUTH_STATE_COOKIE_NAME = 'relic_oauth_state';

export interface AccessPayload {
  type: 'access';
  sub: string;
  email: string;
  name: string | null;
}

export interface RefreshPayload {
  type: 'refresh';
  sub: string;
  jti: string;
}

export interface OAuthStatePayload {
  type: 'oauth-state';
  provider: Provider;
  nonce: string;
  verifier: string;
}

function nowInSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

export function accessTokenMaxAge(): number {
  return env.jwt.accessExpiresIn;
}

export function refreshTokenMaxAge(): number {
  return env.jwt.refreshExpiresIn;
}

export function oauthStateMaxAge(): number {
  return env.jwt.stateExpiresIn;
}

export async function createAccessToken(user: {
  id: number;
  email: string;
  name: string | null;
}): Promise<string> {
  const payload: AccessPayload = {
    type: 'access',
    sub: String(user.id),
    email: user.email,
    name: user.name,
  };
  return sign(
    { ...payload, exp: nowInSeconds() + env.jwt.accessExpiresIn },
    env.jwt.accessSecret,
    JWT_ALG,
  );
}

export async function verifyAccessToken(token: string): Promise<AccessPayload | null> {
  try {
    const payload = await verify(token, env.jwt.accessSecret, JWT_ALG);
    if (payload.type !== 'access' || typeof payload.sub !== 'string') return null;
    return payload as unknown as AccessPayload;
  } catch {
    return null;
  }
}

export async function createRefreshToken(user: { id: number; jti: string }): Promise<string> {
  const payload: RefreshPayload = { type: 'refresh', sub: String(user.id), jti: user.jti };
  return sign(
    { ...payload, exp: nowInSeconds() + env.jwt.refreshExpiresIn },
    env.jwt.refreshSecret,
    JWT_ALG,
  );
}

export async function verifyRefreshToken(token: string): Promise<RefreshPayload | null> {
  try {
    const payload = await verify(token, env.jwt.refreshSecret, JWT_ALG);
    if (
      payload.type !== 'refresh' ||
      typeof payload.sub !== 'string' ||
      typeof payload.jti !== 'string'
    ) {
      return null;
    }
    return payload as unknown as RefreshPayload;
  } catch {
    return null;
  }
}

export async function createOAuthState(provider: Provider, verifier?: string): Promise<string> {
  const nonce = crypto.randomUUID();
  const payload: OAuthStatePayload = {
    type: 'oauth-state',
    provider,
    nonce,
    verifier: verifier ?? '',
  };
  return sign(
    { ...payload, exp: nowInSeconds() + env.jwt.stateExpiresIn },
    env.jwt.accessSecret,
    JWT_ALG,
  );
}

export async function verifyOAuthState(token: string): Promise<OAuthStatePayload | null> {
  try {
    const payload = await verify(token, env.jwt.accessSecret, JWT_ALG);
    if (payload.type !== 'oauth-state' || typeof payload.provider !== 'string') return null;
    return payload as unknown as OAuthStatePayload;
  } catch {
    return null;
  }
}
