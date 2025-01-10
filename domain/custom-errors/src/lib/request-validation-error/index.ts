import { ZodIssue } from 'zod';
import { REQUEST_VALIDATION_ERROR_CODES } from './codes';

export { REQUEST_VALIDATION_ERROR_CODES };

export class RequestValidationError extends Error {
  errorCode: REQUEST_VALIDATION_ERROR_CODES;
  details: ZodIssue[];

  /**
   * @param {REQUEST_VALIDATION_ERROR_CODES} errorCode - The error code
   * @param {ZodIssue[]} details - The details of the validation errors
   */
  constructor(errorCode: REQUEST_VALIDATION_ERROR_CODES, details: ZodIssue[]) {
    super(errorCode);
    this.name = 'RequestValidationError';
    Object.setPrototypeOf(this, RequestValidationError.prototype);
    Error.captureStackTrace(this, this.constructor);
    this.errorCode = errorCode;
    this.details = details;
  }
}

/**
 * Checks if the given error is a RequestValidationError
 * @param {unknown} error - The error to check
 * @returns {boolean} - True if the error is a RequestValidationError, false otherwise
 */
export function isRequestValidationError(error: unknown): error is RequestValidationError {
  return error instanceof RequestValidationError && error.errorCode !== undefined;
}
