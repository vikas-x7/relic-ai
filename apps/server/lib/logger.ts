import pino, { type DestinationStream, type Level, type LoggerOptions } from 'pino';

const VALID_LEVELS: Level[] = ['fatal', 'error', 'warn', 'info', 'debug', 'trace'];

function resolveLogLevel(): Level {
  const raw = (process.env.LOG_LEVEL ?? '').toLowerCase();
  if ((VALID_LEVELS as string[]).includes(raw)) {
    return raw as Level;
  }
  return 'info';
}

const REDACT_PATHS = [
  'password',
  '*.password',
  'secret',
  '*.secret',
  'clientSecret',
  '*.clientSecret',
  'client_secret',
  '*.client_secret',
  'apiKey',
  '*.apiKey',
  'api_key',
  '*.api_key',
  'apikey',
  '*.apikey',
  'token',
  '*.token',
  'accessToken',
  '*.accessToken',
  'access_token',
  '*.access_token',
  'refreshToken',
  '*.refreshToken',
  'refresh_token',
  '*.refresh_token',
  'id_token',
  '*.id_token',
  'authorization',
  '*.authorization',
  'Authorization',
  'cookie',
  '*.cookie',
  'Cookie',
  'set-cookie',
  'Set-Cookie',
  'jwt',
  '*.jwt',
  'bearer',
  '*.bearer',
  'DATABASE_URL',
  '*.DATABASE_URL',
  'connectionString',
  '*.connectionString',
  'connection_string',
  '*.connection_string',
];

const SENSITIVE_JSON_KEY =
  /"((?:access|refresh|id)[_-]?token|client[_-]?secret|api[_-]?key|authorization|jwt|password)"\s*:\s*"[^"]*"/gi;
const SENSITIVE_KEY_VALUE =
  /((?:access|refresh|id)[_-]?token|token|client[_-]?secret|api[_-]?key|authorization|jwt|password)=[^\s&"']+/gi;
const CONNECTION_STRING = /(\w[\w+.-]*:\/\/)[^/@\s]+@/g;
const DATABASE_URL_VALUE = /(DATABASE_URL\s*=\s*)\S+/gi;

export function redactSensitiveValues(text: string): string {
  return text
    .replace(SENSITIVE_JSON_KEY, '"$1":"[REDACTED]"')
    .replace(SENSITIVE_KEY_VALUE, '$1=[REDACTED]')
    .replace(CONNECTION_STRING, '$1[REDACTED]@')
    .replace(DATABASE_URL_VALUE, '$1[REDACTED]');
}

export function redactError(error: unknown): unknown {
  if (!(error instanceof Error)) return error;

  const safe = new Error(redactSensitiveValues(error.message));
  Object.defineProperties(safe, {
    name: { configurable: true, enumerable: true, writable: true, value: error.name },
    stack: {
      configurable: true,
      enumerable: true,
      writable: true,
      value: redactSensitiveValues(typeof error.stack === 'string' ? error.stack : ''),
    },
  });
  const code = (error as { code?: unknown }).code;
  if (typeof code === 'string') {
    Object.defineProperty(safe, 'code', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: code,
    });
  }
  return safe;
}

export interface CreateLoggerOptions {
  level?: Level;
  enabled?: boolean;
  stream?: DestinationStream;
}

function redactSerializedError(error: unknown): unknown {
  const serialized = pino.stdSerializers.err(error as Error) as Record<string, unknown>;
  if (serialized && typeof serialized === 'object') {
    for (const key of ['message', 'stack'] as const) {
      if (typeof serialized[key] === 'string') {
        serialized[key] = redactSensitiveValues(serialized[key]);
      }
    }
  }
  return serialized;
}

export function createLogger(options: CreateLoggerOptions = {}) {
  const pinoOptions: LoggerOptions = {
    name: 'relic-server',
    level: options.level ?? resolveLogLevel(),
    enabled: options.enabled ?? process.env.NODE_ENV !== 'test',
    base: { service: 'relic-server' },
    redact: { paths: REDACT_PATHS, censor: '[REDACTED]' },
    serializers: {
      err: redactSerializedError,
      error: redactSerializedError,
    },
  };

  if (options.stream) {
    return pino(pinoOptions, options.stream);
  }
  return pino(pinoOptions);
}

export const logger = createLogger();

export type { Level };
