export interface AppErrorOptions {
  message: string;
  statusCode?: number;
  errorCode?: string;
  cause?: unknown;
  details?: unknown;
}

export class AppError extends Error {
  readonly statusCode: number;
  readonly errorCode?: string;
  readonly details: unknown;
  readonly isOperational: boolean = true;

  constructor(options: AppErrorOptions) {
    super(options.message);
    this.name = new.target.name;
    this.statusCode = options.statusCode ?? 500;
    this.errorCode = options.errorCode;
    this.details = options.details;
    if (options.cause !== undefined) {
      this.cause = options.cause;
    }
  }
}
