import { ZodIssue } from 'zod';
import { RequestValidationError, isRequestValidationError } from '.';

describe('RequestValidationError', () => {
  const mockZodIssues: ZodIssue[] = [
    {
      code: 'invalid_type',
      expected: 'string',
      received: 'number',
      path: ['name'],
      message: 'Expected string, received number',
    },
  ];

  it('should create an instance with correct properties', () => {
    const error = new RequestValidationError('INVALID_REQUEST_BODY', mockZodIssues);

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(RequestValidationError);
    expect(error.name).toBe('RequestValidationError');
    expect(error.errorCode).toBe('INVALID_REQUEST_BODY');
    expect(error.details).toEqual(mockZodIssues);
    expect(error.message).toBe('INVALID_REQUEST_BODY');
  });

  it('should have correct stack trace', () => {
    const error = new RequestValidationError('INVALID_QUERY_PARAMS', mockZodIssues);

    expect(error.stack).toBeDefined();
    expect(error.stack).toContain('RequestValidationError');
  });

  describe('isRequestValidationError', () => {
    it('should return true for RequestValidationError instances', () => {
      const error = new RequestValidationError('INVALID_ROUTE_PARAMS', mockZodIssues);

      expect(isRequestValidationError(error)).toBe(true);
    });

    it('should return false for other error types', () => {
      const regularError = new Error('Regular error');
      const nullValue = null;
      const undefinedValue = undefined;

      expect(isRequestValidationError(regularError)).toBe(false);
      expect(isRequestValidationError(nullValue)).toBe(false);
      expect(isRequestValidationError(undefinedValue)).toBe(false);
    });
  });
});
