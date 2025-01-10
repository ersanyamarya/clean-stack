import { APP_ERROR_CODE_KEYS, AppError, isAppError } from '../app-error';

export type ErrorHandlerReturnType = {
  name: string;
  status: number;
  message: string | Record<string, unknown>;
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
  process: (error: unknown) => ErrorHandlerReturnType;
};

export const allowedErrors: AllowedError[] = [
  {
    check: isAppError,
    process: (error: unknown) => {
      const appError = error as AppError<APP_ERROR_CODE_KEYS>;
      return {
        name: 'AppError',
        status: appError.statusCode,
        message: appError.context,
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
 * @param onUnhandledError - A callback function that is called when an unhandled error is encountered. The function is passed the error as an argument.
 * @returns An object containing error details such as name, status, message, and errorCode.
 */
export function errorHandler(error: unknown, onUnhandledError: (error: unknown) => void, additionalAllowedErrors?: AllowedError[]): ErrorHandlerReturnType {
  if (!error || error instanceof Error === false) {
    onUnhandledError(error);
    return {
      name: 'Error',
      status: 500,
      message: 'An unknown error occurred',
      errorCode: 'INTERNAL_SERVER_ERROR',
    };
  }

  allowedErrors.push(...(additionalAllowedErrors || []));

  for (const allowedError of allowedErrors) {
    if (allowedError.check(error)) {
      return allowedError.process(error);
    }
  }

  const err = error as Error;
  onUnhandledError(err);
  return {
    name: err.name,
    status: 500,
    message: err.message,
    errorCode: 'INTERNAL_SERVER_ERROR',
  };
}
