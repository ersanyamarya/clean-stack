import { Logger } from '@clean-stack/global_types';
import { describe, expect, it, vi } from 'vitest';
import { AppError } from '../app-error';
import { errorHandler, ErrorHandlerReturnType } from './index';

describe('errorHandler', () => {
  const mockLogger = {
    error: vi.fn(),
  } as unknown as Logger;

  it('should handle null correctly', () => {
    const result: ErrorHandlerReturnType = errorHandler(null, mockLogger);

    expect(result.status).toBe(500);
    expect(result.message).toBe('Internal Server Error');
    expect(result.errorCode).toBe('INTERNAL_SERVER_ERROR');
    expect(mockLogger.error).toHaveBeenCalledWith({
      errorCode: 'INTERNAL_SERVER_ERROR',
      where: 'errorHandler',
      context: null,
    });
  });

  it('should handle undefined correctly', () => {
    const result: ErrorHandlerReturnType = errorHandler(undefined, mockLogger);

    expect(result.status).toBe(500);
    expect(result.message).toBe('Internal Server Error');
    expect(result.errorCode).toBe('INTERNAL_SERVER_ERROR');
    expect(mockLogger.error).toHaveBeenCalledWith({
      errorCode: 'INTERNAL_SERVER_ERROR',
      where: 'errorHandler',
      context: undefined,
    });
  });

  it('should handle non-error objects correctly', () => {
    const nonErrorObject = { some: 'object' };
    const result: ErrorHandlerReturnType = errorHandler(nonErrorObject, mockLogger);

    expect(result.status).toBe(500);
    expect(result.message).toBe('Internal Server Error');
    expect(result.errorCode).toBe('INTERNAL_SERVER_ERROR');
    expect(mockLogger.error).toHaveBeenCalledWith({
      errorCode: 'INTERNAL_SERVER_ERROR',
      where: 'errorHandler',
      context: nonErrorObject,
    });
  });

  it('should handle AppError correctly', () => {
    const errorCode = 'RESOURCE_NOT_FOUND';
    const context = { userId: 123 };
    const metadata = { resource: 'user' };
    const appError = new AppError(errorCode, { context, metadata });

    const result: ErrorHandlerReturnType = errorHandler(appError, mockLogger);

    expect(result.status).toBe(appError.statusCode);
    expect(result.message).toBe(appError.message);
    expect(result.errorCode).toBe(appError.errorCode);
    expect(result.name).toBe('AppError');
  });

  it('should handle unknown errors correctly', () => {
    const unknownError = new Error('Unknown error');

    const result: ErrorHandlerReturnType = errorHandler(unknownError, mockLogger);

    expect(result.status).toBe(500);
    expect(result.message).toBe(unknownError.message);
    expect(result.errorCode).toBe('INTERNAL_SERVER_ERROR');
    expect(result.name).toBe(unknownError.name);
  });
});
