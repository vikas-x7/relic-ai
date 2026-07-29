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
  nodeEnv,
  isProd: nodeEnv === 'production',
  serverUrl: (process.env.SERVER_URL ?? 'http://localhost:3000').replace(/\/+$/, ''),
  webUrl: (process.env.WEB_URL ?? 'http://localhost:3001').replace(/\/+$/, ''),
  cookieDomain: process.env.COOKIE_DOMAIN ?? '',
  corsOrigins: (process.env.CORS_ORIGINS ?? '').split(',').filter(Boolean),
  jwt: {
    accessSecret: required('JWT_SECRET', process.env.JWT_SECRET),
    refreshSecret: required('REFRESH_TOKEN_SECRET', process.env.REFRESH_TOKEN_SECRET),
    accessExpiresIn: parseDuration(process.env.JWT_EXPIRES_IN, '15m'),
    refreshExpiresIn: parseDuration(process.env.JWT_REFRESH_EXPIRES_IN, '15d'),
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
  llm: {
    apiKey: required('NVIDIA_API_KEY', process.env.NVIDIA_API_KEY),
    baseUrl: process.env.LLM_BASE_URL ?? 'https://integrate.api.nvidia.com/v1',
    model: process.env.LLM_MODEL ?? 'google/diffusiongemma-26b-a4b-it',
    temperature: Number(process.env.LLM_TEMPERATURE ?? 1),
    topP: Number(process.env.LLM_TOP_P ?? 0.95),
    maxTokens: Number(process.env.LLM_MAX_TOKENS ?? 4096),
  },
  search: {
    tavilyApiKey: process.env.TAVILY_API_KEY ?? '',
    maxResults: Number(process.env.TAVILY_MAX_RESULTS ?? 5),
  },
};
