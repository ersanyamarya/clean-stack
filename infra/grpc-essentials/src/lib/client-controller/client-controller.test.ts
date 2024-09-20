import { ClientUnaryCall, Metadata, ServiceError } from '@grpc/grpc-js';
import { describe, expect, it, vi } from 'vitest';
import { grpcClientPromisify } from '.';

describe('grpcClientPromisify', () => {
  it('should resolve with the response when the method succeeds', async () => {
    const mockResponse = { data: 'test' };
    const mockMethod = vi.fn((request, metadata, callback) => {
      callback(null, mockResponse);
      return {} as ClientUnaryCall;
    });

    const promisifiedMethod = grpcClientPromisify(mockMethod);
    const response = await promisifiedMethod({}, new Metadata());

    expect(response).toEqual(mockResponse);
    expect(mockMethod).toHaveBeenCalled();
  });

  it('should reject with an error when the method fails', async () => {
    const mockError = new Error('Test error') as ServiceError;
    const mockMethod = vi.fn((request, metadata, callback) => {
      callback(mockError, null);
      return {} as ClientUnaryCall;
    });

    const promisifiedMethod = grpcClientPromisify(mockMethod);

    await expect(promisifiedMethod({}, new Metadata())).rejects.toThrow('Test error');
    expect(mockMethod).toHaveBeenCalled();
  });

  it('should create new Metadata if none is provided', async () => {
    const mockResponse = { data: 'test' };
    const mockMethod = vi.fn((request, metadata, callback) => {
      callback(null, mockResponse);
      return {} as ClientUnaryCall;
    });

    const promisifiedMethod = grpcClientPromisify(mockMethod);
    const response = await promisifiedMethod({});

    expect(response).toEqual(mockResponse);
    expect(mockMethod).toHaveBeenCalled();
  });
});
