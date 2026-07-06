import 'dotenv/config';

export function parseDuration(value: string | undefined, fallback: string): number {
  const raw = value?.trim() || fallback;
  const match = raw.match(/^(\d+)\s*(s|m|h|d|w)?$/i);
  if (!match) {
    throw new Error(`Invalid duration format: "${raw}" (use e.g. 30s, 15m, 12h, 7d)`);
  }
  const num = Number(match[1]);
  const unit = (match[2] ?? 's').toLowerCase();
  const multipliers: Record<string, number> = {
    s: 1,
    m: 60,
    h: 60 * 60,
    d: 60 * 60 * 24,
    w: 60 * 60 * 24 * 7,
  };
  return num * multipliers[unit];
}

const nodeEnv = process.env.NODE_ENV ?? 'development';

function withoutTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '');
}

export const env = {
  port: Number(process.env.PORT ?? 3001),
  nodeEnv,
  isProd: nodeEnv === 'production',
  serverUrl: withoutTrailingSlash(process.env.SERVER_URL ?? 'http://localhost:3001'),
  webUrl: withoutTrailingSlash(process.env.WEB_URL ?? 'http://localhost:3000'),
  jwt: {
    accessSecret: process.env.JWT_SECRET ?? '',
    refreshSecret: process.env.REFRESH_TOKEN_SECRET ?? '',
    accessExpiresIn: parseDuration(process.env.JWT_EXPIRES_IN, '15m'),
    refreshExpiresIn: parseDuration(process.env.JWT_REFRESH_EXPIRES_IN, '7d'),
    stateExpiresIn: parseDuration(process.env.OAUTH_STATE_EXPIRES_IN, '10m'),
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID ?? '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
  },
  github: {
    clientId: process.env.GITHUB_CLIENT_ID ?? '',
    clientSecret: process.env.GITHUB_CLIENT_SECRET ?? '',
  },
};

/**
 * Keep configuration errors request-scoped. Throwing during module import turns
 * every route (including / and /health) into Vercel FUNCTION_INVOCATION_FAILED.
 */
export function assertAuthConfiguration(): void {
  const missing = [
    !env.jwt.accessSecret && 'JWT_SECRET',
    !env.jwt.refreshSecret && 'REFRESH_TOKEN_SECRET',
    env.isProd && !process.env.SERVER_URL && 'SERVER_URL',
    env.isProd && !process.env.WEB_URL && 'WEB_URL',
  ].filter(Boolean);

  if (missing.length > 0) {
    throw new Error(`Missing authentication configuration: ${missing.join(', ')}`);
  }
}
