import httpStatusCodes from 'http-status-codes';
import { z, ZodTypeAny } from 'zod';
import { APP_ERROR_CODE_KEYS, appErrorCodes } from './codes';

export type { APP_ERROR_CODE_KEYS };

type AppErrorOptions<ErrorCode extends APP_ERROR_CODE_KEYS> = {
  context?: Record<string, unknown>;
  metadata?: z.infer<ErrorCode extends APP_ERROR_CODE_KEYS ? (typeof appErrorCodes)[ErrorCode]['metaData'] : ZodTypeAny>;
};

/**
 * Represents an application-specific error with additional metadata and context.
 *
 * @template ErrorCode - The type of the error code, extending from ERROR_CODE_KEYS.
 */
export class AppError<ErrorCode extends APP_ERROR_CODE_KEYS> extends Error {
  public errorCode: ErrorCode;
  public where: string | undefined;
  public metadata: z.infer<ErrorCode extends APP_ERROR_CODE_KEYS ? (typeof appErrorCodes)[ErrorCode]['metaData'] : ZodTypeAny> | null;
  public statusCode: number = httpStatusCodes.INTERNAL_SERVER_ERROR;
  public context: Record<string, unknown> = {};

  constructor(code: ErrorCode, { context = {}, metadata }: AppErrorOptions<ErrorCode> = {}) {
    super(code as string);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);

    this.errorCode = code;
    this.statusCode = appErrorCodes[code as APP_ERROR_CODE_KEYS]?.statusCode || httpStatusCodes.INTERNAL_SERVER_ERROR;
    this.context = context;

    const stack = this.stack?.split('\n');
    const where = stack?.[1]?.trim().replace('at ', '');
    this.where = where;

    this.metadata = metadata || null;
  }
}

/**
 * Checks if the provided error is an instance of `AppError` and has a defined error code.
 *
 * @param error - The error to check.
 * @returns A boolean indicating whether the error is an `AppError` with a defined error code.
 */
export function isAppError(error: unknown): error is AppError<APP_ERROR_CODE_KEYS> {
  return error instanceof AppError && error.errorCode !== undefined;
}
