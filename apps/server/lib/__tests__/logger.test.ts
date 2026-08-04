import { describe, expect, it } from '@jest/globals';
import type { Level } from 'pino';
import {
  createLogger,
  redactError,
  redactSensitiveValues,
  type CreateLoggerOptions,
} from '../logger';

function captureStream() {
  const lines: string[] = [];
  return {
    lines,
    stream: {
      write(msg: string) {
        lines.push(msg);
      },
    },
  };
}

const LOG_LEVEL_VALUES: Record<string, { level: Level; value: number }> = {
  fatal: { level: 'fatal', value: 60 },
  error: { level: 'error', value: 50 },
  warn: { level: 'warn', value: 40 },
  info: { level: 'info', value: 30 },
  debug: { level: 'debug', value: 20 },
  trace: { level: 'trace', value: 10 },
};

function makeLogger(options: CreateLoggerOptions = {}) {
  const { lines, stream } = captureStream();
  const log = createLogger({ enabled: true, ...options, stream });
  return { lines, log };
}

describe('createLogger', () => {
  it('emits JSON lines to the provided stream', () => {
    const { lines, log } = makeLogger();
    log.info({ hello: 'world' }, 'a message');
    expect(lines).toHaveLength(1);
    const entry = JSON.parse(lines[0]);
    expect(entry.hello).toBe('world');
    expect(entry.msg).toBe('a message');
  });

  it.each(Object.entries(LOG_LEVEL_VALUES))(
    'uses the level %s with numeric value %i',
    (_key, { level, value }) => {
      const { lines, log } = makeLogger({ level });
      log[level]('test');
      const entry = JSON.parse(lines[0]);
      expect(entry.level).toBe(value);
    },
  );

  it('defaults to info level when no LOG_LEVEL is set', () => {
    const previous = process.env.LOG_LEVEL;
    delete process.env.LOG_LEVEL;
    try {
      const { lines, log } = makeLogger();
      log.info('info record');
      log.debug('debug record');
      expect(lines).toHaveLength(1);
      expect(JSON.parse(lines[0]).level).toBe(30);
    } finally {
      process.env.LOG_LEVEL = previous;
    }
  });

  it('attaches service metadata to every record', () => {
    const { lines, log } = makeLogger({ level: 'info' });
    log.info('test');
    const entry = JSON.parse(lines[0]);
    expect(entry.service).toBe('relic-server');
  });

  it('honors the LOG_LEVEL environment variable when no explicit level is given', () => {
    const previous = process.env.LOG_LEVEL;
    process.env.LOG_LEVEL = 'debug';
    try {
      const { lines, log } = makeLogger();
      log.debug('verbose detail');
      const entry = JSON.parse(lines[0]);
      expect(entry.level).toBe(20);
    } finally {
      process.env.LOG_LEVEL = previous;
    }
  });
});

describe('redaction', () => {
  it('redacts sensitive keys in logged objects', () => {
    const { lines, log } = makeLogger({ level: 'info' });
    log.info({
      user: { password: 'hunter2', apiKey: 'sk-123' },
      access_token: 'jwt.payload',
      authorization: 'Bearer abc.def.ghi',
      DATABASE_URL: 'postgres://user:pass@localhost:5432/db',
    });
    const raw = lines[0];
    expect(raw).not.toContain('hunter2');
    expect(raw).not.toContain('sk-123');
    expect(raw).not.toContain('jwt.payload');
    expect(raw).not.toContain('abc.def.ghi');
    expect(raw).not.toContain('user:pass@localhost');
    expect(raw).toContain('[REDACTED]');
  });

  it('preserves non-sensitive metadata', () => {
    const { lines, log } = makeLogger({ level: 'info' });
    log.info({ conversationId: 42 });
    const entry = JSON.parse(lines[0]);
    expect(entry.conversationId).toBe(42);
  });

  it('serializes errors with type, message and stack', () => {
    const { lines, log } = makeLogger({ level: 'info' });
    const error = new Error('boom');
    log.info({ err: error }, 'failed');
    const entry = JSON.parse(lines[0]);
    expect(entry.err.type).toBe('Error');
    expect(entry.err.message).toBe('boom');
    expect(entry.err.stack).toContain('Error: boom');
  });

  it('redacts secrets embedded in serialized error objects', () => {
    const { lines, log } = makeLogger({ level: 'info' });
    const error = new Error('oauth failed with "access_token":"super.secret.token"');
    log.error({ err: error }, 'failed');
    const raw = lines[0];
    expect(raw).not.toContain('super.secret.token');
    expect(raw).toContain('[REDACTED]');
  });
});

describe('redactSensitiveValues', () => {
  it('redacts URL-embedded credentials', () => {
    expect(redactSensitiveValues('connect to postgres://admin:secret@db.internal:5432/app')).toBe(
      'connect to postgres://[REDACTED]@db.internal:5432/app',
    );
  });

  it('does not redact the host or path of a connection string', () => {
    expect(redactSensitiveValues('postgres://[REDACTED]@db.internal:5432/app')).toBe(
      'postgres://[REDACTED]@db.internal:5432/app',
    );
  });

  it('redacts JSON key/value pairs containing tokens and keys', () => {
    expect(redactSensitiveValues('{"access_token":"abc.def","api_key":"xyz"}')).toBe(
      '{"access_token":"[REDACTED]","api_key":"[REDACTED]"}',
    );
  });

  it('redacts query-style secrets', () => {
    expect(redactSensitiveValues('token=aaa.bbb&refresh_token=ccc')).toBe(
      'token=[REDACTED]&refresh_token=[REDACTED]',
    );
  });

  it('redacts DATABASE_URL assignment values', () => {
    expect(redactSensitiveValues('DATABASE_URL=postgresql://user:pass@localhost:5432/prod')).toBe(
      'DATABASE_URL=[REDACTED]',
    );
  });

  it('leaves ordinary text untouched', () => {
    expect(redactSensitiveValues('just a normal error message')).toBe(
      'just a normal error message',
    );
  });
});

describe('redactError', () => {
  it('returns non-Error values unchanged', () => {
    expect(redactError('not an error')).toBe('not an error');
    expect(redactError(undefined)).toBe(undefined);
  });

  it('preserves name, code and stack while scrubbing the message', () => {
    const error = new Error('failed with postgres://user:s3cret@host:5432/db');
    error.name = 'DatabaseError';
    (error as { code?: string }).code = 'P1001';
    const safe = redactError(error) as Error & { code?: string };

    expect(safe).toBeInstanceOf(Error);
    expect(safe.name).toBe('DatabaseError');
    expect(safe.code).toBe('P1001');
    expect(safe.message).toBe('failed with postgres://[REDACTED]@host:5432/db');
    expect(safe.stack).toContain('failed with postgres://[REDACTED]@host:5432/db');
    expect(safe.stack).not.toContain('s3cret');
  });
});
