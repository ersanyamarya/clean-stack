import { Logger } from '@clean-stack/global_types';
import { AppError, ERROR_CODE_KEYS, isAppError } from '../app-error';

export type ErrorHandlerReturnType = {
  name: string;
  status: number;
  message: string;
  errorCode: string;
};

export type AllowedError = {
  check: (error: unknown) => boolean;
  process: (error: unknown, logger: Logger) => ErrorHandlerReturnType;
};

export const allowedErrors: AllowedError[] = [
  {
    check: (error: unknown) => !error || error instanceof Error === false,
    process: (error: unknown, logger: Logger) => {
      logger.error({
        errorCode: 'INTERNAL_SERVER_ERROR',
        where: 'errorHandler',
        context: error,
      });

      return {
        name: 'Error',
        status: 500,
        message: 'Internal Server Error',
        errorCode: 'INTERNAL_SERVER_ERROR',
      };
    },
  },

  {
    check: isAppError,
    process: (error: unknown) => {
      const appError = error as AppError<ERROR_CODE_KEYS>;
      return {
        name: 'AppError',
        status: appError.statusCode,
        message: appError.message,
        errorCode: appError.errorCode,
      };
    },
  },
];

export function errorHandler(error: unknown, logger: Logger): ErrorHandlerReturnType {
  for (const allowedError of allowedErrors) {
    if (allowedError.check(error)) {
      return allowedError.process(error, logger);
    }
  }

  const err = error as Error;
  logger.error({
    errorCode: 'INTERNAL_SERVER_ERROR',
    where: 'errorHandler',
    context: err,
  });
  return {
    name: err.name,
    status: 500,
    message: err.message,
    errorCode: 'INTERNAL_SERVER_ERROR',
  };
}
