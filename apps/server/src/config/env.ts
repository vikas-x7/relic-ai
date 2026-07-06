import 'dotenv/config';

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

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

export const env = {
  port: Number(process.env.PORT ?? 3001),
  nodeEnv,
  isProd: nodeEnv === 'production',
  serverUrl: process.env.SERVER_URL ?? 'http://localhost:3001',
  webUrl: process.env.WEB_URL ?? 'http://localhost:3000',
  jwt: {
    accessSecret: required('JWT_SECRET', process.env.JWT_SECRET),
    refreshSecret: required('REFRESH_TOKEN_SECRET', process.env.REFRESH_TOKEN_SECRET),
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
