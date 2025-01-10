import httpStatusCodes from 'http-status-codes';
import { describe, expect, it } from 'vitest';
import { APP_ERROR_CODE_KEYS } from './codes';
import { AppError, isAppError } from './index';

describe('AppError', () => {
  const errorCode: APP_ERROR_CODE_KEYS = 'RESOURCE_NOT_FOUND';

  it('should create an instance of AppError with correct properties', () => {
    const context = { userId: 123 };
    const metadata = { resource: 'user' };

    const error = new AppError(errorCode, { context, metadata });

    expect(error).toBeInstanceOf(AppError);
    expect(error.name).toBe('AppError');
    expect(error.errorCode).toBe(errorCode);
    expect(error.statusCode).toBe(httpStatusCodes.NOT_FOUND);
    expect(error.where).toBeDefined();
    expect(error.metadata).toEqual(metadata);
  });

  it('should default metadata to null if not provided', () => {
    const error = new AppError(errorCode);

    expect(error.metadata).toBeNull();
  });

  it('should set statusCode to INTERNAL_SERVER_ERROR if errorCode is not found', () => {
    const invalidErrorCode = 'INVALID_ERROR_CODE' as APP_ERROR_CODE_KEYS;
    const error = new AppError(invalidErrorCode);

    expect(error.statusCode).toBe(httpStatusCodes.INTERNAL_SERVER_ERROR);
  });

  it('should capture the correct stack trace', () => {
    const error = new AppError(errorCode);
    expect(error.where).toContain('app-error.spec.ts');
  });

  it('should set context correctly', () => {
    const context = { action: 'test' };
    const error = new AppError(errorCode, { context });
    expect(error.context).toEqual(context);
  });
});

describe('isAppError', () => {
  it('should return true for instances of AppError', () => {
    const error = new AppError('USER_UNAUTHENTICATED');
    expect(isAppError(error)).toBe(true);
  });

  it('should return false for non-AppError instances', () => {
    const error = new Error('Some error');
    expect(isAppError(error)).toBe(false);
  });

  it('should return false for objects that are not instances of Error', () => {
    const error = { message: 'Some error' };
    expect(isAppError(error)).toBe(false);
  });
});
