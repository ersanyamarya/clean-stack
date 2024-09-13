import { Logger } from '@clean-stack/global_types';
import { AppError, ERROR_CODE_KEYS, isAppError } from '../app-error';

export type ErrorHandlerReturnType = {
  name: string;
  status: number;
  message: string;
  errorCode: string;
};

/**
 * The type AllowedError defines a structure for handling and processing errors in TypeScript.
 * @property check - The `check` property in the `AllowedError` type is a function that takes an
 * `error` of type `unknown` as a parameter and returns a boolean value. This function is used to check
 * if a specific error meets certain criteria or conditions.
 * @property process - The `process` property in the `AllowedError` type is a function that takes two
 * parameters: `error` of type `unknown` and `logger` of type `Logger`. It returns a value of type
 * `ErrorHandlerReturnType`.
 */
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

/**
 * Handles errors by checking against a list of allowed errors and processing them accordingly.
 * If the error is not in the allowed list, it logs the error and returns a generic internal server error response.
 *
 * @param error - The error to be handled. Can be of any type.
 * @param logger - The logger instance used to log error details.
 * @returns An object containing error details such as name, status, message, and errorCode.
 */
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
