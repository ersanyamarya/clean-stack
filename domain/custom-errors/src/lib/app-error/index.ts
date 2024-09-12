import httpStatusCodes from 'http-status-codes';
import { z, ZodTypeAny } from 'zod';
import { ERROR_CODE_KEYS, errorCodes } from './codes';

export type { ERROR_CODE_KEYS };

type AppErrorOptions<ErrorCode extends ERROR_CODE_KEYS> = {
  context?: Record<string, unknown>;
  metadata?: z.infer<ErrorCode extends ERROR_CODE_KEYS ? (typeof errorCodes)[ErrorCode]['metaData'] : ZodTypeAny>;
};

export class AppError<ErrorCode extends ERROR_CODE_KEYS> extends Error {
  public errorCode: ErrorCode;
  public where: string | undefined;
  public metadata: z.infer<ErrorCode extends ERROR_CODE_KEYS ? (typeof errorCodes)[ErrorCode]['metaData'] : ZodTypeAny> | null;
  public statusCode: number = httpStatusCodes.INTERNAL_SERVER_ERROR;
  public context: Record<string, unknown> = {};

  constructor(code: ErrorCode, { context = {}, metadata }: AppErrorOptions<ErrorCode> = {}) {
    super(code as string);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);

    this.errorCode = code;
    this.statusCode = errorCodes[code as ERROR_CODE_KEYS]?.statusCode || httpStatusCodes.INTERNAL_SERVER_ERROR;
    this.context = context;

    const stack = this.stack?.split('\n');
    const where = stack?.[1]?.trim().replace('at ', '');
    this.where = where;

    this.metadata = metadata || null;
  }
}

export function isAppError(error: unknown): error is AppError<ERROR_CODE_KEYS> {
  return error instanceof AppError && error.errorCode !== undefined;
}
