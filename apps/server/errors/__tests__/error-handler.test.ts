import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { requestId } from 'hono/request-id';
import { createApp } from '@/app';
import { logger } from '@/lib/logger';
import {
  ConversationAccessDeniedError,
  ConversationNotFoundError,
} from '../../modules/chat/services/chat.service';
import { AppError } from '../AppError';
import { createErrorHandler } from '../error-handler';

function buildTestApp(): Hono {
  const app = new Hono().basePath('/api');
  app.use('*', requestId());
  app.onError(createErrorHandler());

  app.get('/throw/not-found', () => {
    throw new ConversationNotFoundError();
  });
  app.get('/throw/access-denied', () => {
    throw new ConversationAccessDeniedError();
  });
  app.get('/throw/conflict', () => {
    throw new AppError({
      message: 'Resource already exists',
      statusCode: 409,
      errorCode: 'RESOURCE_EXISTS',
    });
  });
  app.get('/throw/bad-request', () => {
    throw new AppError({ message: 'Invalid payload', statusCode: 400, errorCode: 'BAD_REQUEST' });
  });
  app.get('/throw/bare-not-found', () => {
    throw new AppError({ message: 'Gone missing', statusCode: 404 });
  });
  app.get('/throw/http-exception', () => {
    throw new HTTPException(401, { message: 'Auth required' });
  });
  app.get('/throw/unknown', () => {
    throw new Error('secret internal database information');
  });

  return app;
}

describe('global error handler - known application errors', () => {
  const app = buildTestApp();

  it('maps ConversationNotFoundError to 404 with a safe message and error code', async () => {
    const res = await app.request('/api/throw/not-found');
    expect(res.status).toBe(404);

    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('CONVERSATION_NOT_FOUND');
    expect(body.error.message).toBe('Conversation not found');
    expect(body.error.requestId).toEqual(expect.any(String));
  });

  it('maps ConversationAccessDeniedError to 403 with a safe message and error code', async () => {
    const res = await app.request('/api/throw/access-denied');
    expect(res.status).toBe(403);

    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('CONVERSATION_ACCESS_DENIED');
    expect(body.error.message).toBe('Access denied');
  });

  it('maps a generic AppError with explicit status and code', async () => {
    const res = await app.request('/api/throw/conflict');
    expect(res.status).toBe(409);

    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('RESOURCE_EXISTS');
    expect(body.error.message).toBe('Resource already exists');
  });

  it('maps a generic AppError with a 400 status', async () => {
    const res = await app.request('/api/throw/bad-request');
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error.code).toBe('BAD_REQUEST');
    expect(body.error.message).toBe('Invalid payload');
  });

  it('derives the error code from the status when AppError omits one', async () => {
    const res = await app.request('/api/throw/bare-not-found');
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error.code).toBe('NOT_FOUND');
    expect(body.error.message).toBe('Gone missing');
  });

  it('maps Hono HTTPException to its status with the mapped error code', async () => {
    const res = await app.request('/api/throw/http-exception');
    expect(res.status).toBe(401);

    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('UNAUTHORIZED');
    expect(body.error.message).toBe('Auth required');
  });

  it('includes a request id in the body and the X-Request-Id header', async () => {
    const res = await app.request('/api/throw/not-found');
    const headerId = res.headers.get('x-request-id');
    const body = (await res.json()) as { error: { requestId: string } };

    expect(headerId).toBeTruthy();
    expect(body.error.requestId).toBe(headerId);
  });
});

describe('global error handler - unknown errors', () => {
  const app = buildTestApp();

  it('returns 500 with a safe generic message and hides internal details', async () => {
    const res = await app.request('/api/throw/unknown');
    expect(res.status).toBe(500);

    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('INTERNAL_SERVER_ERROR');
    expect(body.error.message).toBe('Something went wrong');

    const raw = JSON.stringify(body);
    expect(raw).not.toContain('secret internal database information');
    expect(raw).not.toContain('error-handler.ts');
    expect(raw).not.toContain('    at ');

    const headers = res.headers.get('content-type') ?? '';
    expect(headers).toContain('application/json');
  });

  it('logs the internal error details including stack, method and path', async () => {
    const spy = jest.spyOn(logger, 'error').mockImplementation(() => undefined);

    try {
      const res = await app.request('/api/throw/unknown');
      expect(res.status).toBe(500);

      const logOutput = spy.mock.calls.map((call) =>
        call
          .map((arg) =>
            typeof arg === 'object' && arg !== null ? JSON.stringify(arg) : String(arg),
          )
          .join(' '),
      );
      const combined = logOutput.join('\n');

      expect(combined).toContain('GET');
      expect(combined).toContain('/api/throw/unknown');
      expect(combined).toContain('500');
      expect(combined).toContain('INTERNAL_SERVER_ERROR');
      expect(combined).toContain('secret internal database information');
      expect(combined).toContain('Error');
    } finally {
      spy.mockRestore();
    }
  });
});

describe('global error handler - response format and security', () => {
  const app = buildTestApp();

  it('never returns stack traces or error class names to clients', async () => {
    const res = await app.request('/api/throw/unknown');
    const raw = JSON.stringify(await res.json());

    expect(raw).not.toContain('at ConversationNotFoundError');
    expect(raw).not.toContain('Error:');
    expect(raw).not.toContain('http://');
  });

  it('does not leak sensitive values embedded in unknown errors', async () => {
    const appWithSecrets = new Hono().basePath('/api');
    appWithSecrets.use('*', requestId());
    appWithSecrets.onError(createErrorHandler());

    appWithSecrets.get('/leak', () => {
      throw new Error(
        'connection failed postgres://admin:s3cret@db.internal:5432/app DATABASE_URL leaked',
      );
    });

    const res = await appWithSecrets.request('/api/leak');
    expect(res.status).toBe(500);
    const raw = JSON.stringify(await res.json());

    expect(raw).not.toContain('s3cret');
    expect(raw).not.toContain('db.internal');
    expect(raw).not.toContain('postgres://');
  });
});

describe('global error handler - app integration', () => {
  it('createApp registers the handler so uncaught route errors are handled safely', async () => {
    const app = createApp();
    app.get('/boom', () => {
      throw new Error('DATABASE_URL=postgresql://user:pass@localhost:5432/prod');
    });

    const res = await app.request('/api/boom');
    expect(res.status).toBe(500);

    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('INTERNAL_SERVER_ERROR');
    expect(body.error.message).toBe('Something went wrong');

    const raw = JSON.stringify(body);
    expect(raw).not.toContain('postgresql://');
    expect(raw).not.toContain('DATABASE_URL');
  });

  it('existing endpoints keep their behavior', async () => {
    const app = createApp();
    const res = await app.request('/api/health');
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ status: 'ok' });
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});
