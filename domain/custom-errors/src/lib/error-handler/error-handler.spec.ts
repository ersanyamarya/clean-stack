import { describe, expect, it, Mock, vi } from 'vitest';
import { APP_ERROR_CODE_KEYS, AppError } from '../app-error';
import { errorHandler, ErrorHandlerReturnType } from './index';

describe('errorHandler', () => {
  let mockOnUnhandledError: Mock;

  beforeEach(() => {
    mockOnUnhandledError = vi.fn();
  });

  it('should handle unknown errors', () => {
    const result: ErrorHandlerReturnType = errorHandler(null, mockOnUnhandledError);

    expect(mockOnUnhandledError).toHaveBeenCalledWith(null);
    expect(result).toEqual({
      name: 'Error',
      status: 500,
      message: 'An unknown error occurred',
      errorCode: 'INTERNAL_SERVER_ERROR',
    });
  });

  it('should handle non-Error objects', () => {
    const nonErrorObject = { foo: 'bar' };
    const result: ErrorHandlerReturnType = errorHandler(nonErrorObject, mockOnUnhandledError);

    expect(mockOnUnhandledError).toHaveBeenCalledWith(nonErrorObject);
    expect(result).toEqual({
      name: 'Error',
      status: 500,
      message: 'An unknown error occurred',
      errorCode: 'INTERNAL_SERVER_ERROR',
    });
  });

  it('should handle AppError correctly', () => {
    const appError = new AppError<APP_ERROR_CODE_KEYS>('RESOURCE_NOT_FOUND', { context: { resource: 'User' } });
    const result: ErrorHandlerReturnType = errorHandler(appError, mockOnUnhandledError);
    expect(mockOnUnhandledError).not.toHaveBeenCalled();
    expect(result).toEqual({
      name: 'AppError',
      status: 404,
      message: { resource: 'User' },
      errorCode: 'RESOURCE_NOT_FOUND',
    });
  });

  it('should handle generic Error objects', () => {
    const genericError = new Error('Generic error message');
    const result: ErrorHandlerReturnType = errorHandler(genericError, mockOnUnhandledError);

    expect(mockOnUnhandledError).toHaveBeenCalledWith(genericError);
    expect(result).toEqual({
      name: 'Error',
      status: 500,
      message: 'Generic error message',
      errorCode: 'INTERNAL_SERVER_ERROR',
    });
  });

  it('handles gRPC ServiceError correctly', () => {
    // Arrange: create an Error instance and set its prototype to mimic ServiceError
    const grpcError = new Error('gRPC error') as import('@grpc/grpc-js').ServiceError & { code: number; details: string };
    grpcError.name = 'ServiceError';
    grpcError.code = 5; // NOT_FOUND
    grpcError.details = 'Resource not found';
    Object.setPrototypeOf(grpcError, Object.create(Error.prototype));
    const mockOnUnhandledError = vi.fn();

    // Act
    const result: ErrorHandlerReturnType = errorHandler(grpcError, mockOnUnhandledError);

    // Assert
    expect(mockOnUnhandledError).not.toHaveBeenCalled();
    expect(result).toEqual({
      name: 'ServiceError',
      status: 404, // grpcErrorCodes[5].statusCode
      message: expect.any(String), // message from grpcErrorCodes[5].en
      errorCode: 'NOT_FOUND',
    });
  });
});
