import { HTTPException } from 'hono/http-exception';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import type { Context } from 'hono';
import { AppError } from './AppError';

const INTERNAL_SERVER_ERROR_CODE = 'INTERNAL_SERVER_ERROR';
const INTERNAL_SERVER_ERROR_MESSAGE = 'Something went wrong';

function safeStatusCode(statusCode: unknown): number {
  return typeof statusCode === 'number' &&
    Number.isInteger(statusCode) &&
    statusCode >= 400 &&
    statusCode <= 599
    ? statusCode
    : 500;
}

function errorCodeForStatus(statusCode: number): string {
  switch (statusCode) {
    case 400:
      return 'BAD_REQUEST';
    case 401:
      return 'UNAUTHORIZED';
    case 403:
      return 'FORBIDDEN';
    case 404:
      return 'NOT_FOUND';
    case 409:
      return 'CONFLICT';
    default:
      return INTERNAL_SERVER_ERROR_CODE;
  }
}

function classifyErrorCode(errorCode: unknown, statusCode: number): string {
  if (typeof errorCode === 'string' && errorCode.trim().length > 0 && errorCode.length <= 64) {
    return errorCode;
  }
  return errorCodeForStatus(statusCode);
}

interface HandlerResult {
  statusCode: ContentfulStatusCode;
  errorCode: string;
  message: string;
}

function classify(err: unknown): HandlerResult {
  if (err instanceof AppError) {
    const code = safeStatusCode(err.statusCode) as ContentfulStatusCode;
    return {
      statusCode: code,
      errorCode: classifyErrorCode(err.errorCode, code),
      message: err.message,
    };
  }

  if (err instanceof HTTPException) {
    const code = safeStatusCode(err.status) as ContentfulStatusCode;
    return {
      statusCode: code,
      errorCode: errorCodeForStatus(code),
      message: err.message,
    };
  }

  return {
    statusCode: 500 as ContentfulStatusCode,
    errorCode: INTERNAL_SERVER_ERROR_CODE,
    message: INTERNAL_SERVER_ERROR_MESSAGE,
  };
}

export function createErrorHandler() {
  return function globalErrorHandler(err: Error, c: Context) {
    const { statusCode, errorCode, message } = classify(err);
    const method = c.req.method;
    const path = c.req.path;
    const requestIdValue = c.get('requestId') ?? crypto.randomUUID();

    console.error(
      `[error] ${requestIdValue} ${method} ${path} failed with ${statusCode} ${errorCode}`,
    );
    console.error(`[error] ${requestIdValue} internal message:`, err?.message ?? 'no message');
    console.error(`[error] ${requestIdValue} client message:`, message);
    console.error(`[error] ${requestIdValue} stack:`, err?.stack ?? 'no stack');

    const errorPayload: Record<string, unknown> = {
      code: errorCode,
      message,
      requestId: requestIdValue,
    };

    return c.json({ success: false, error: errorPayload }, statusCode);
  };
}
