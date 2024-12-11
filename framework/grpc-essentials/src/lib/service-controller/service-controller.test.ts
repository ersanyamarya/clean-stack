import { Logger } from '@clean-stack/framework/global-types';
import { Metadata, sendUnaryData, ServerUnaryCall, status } from '@grpc/grpc-js';
import { describe, expect, it, vi } from 'vitest';
import { createGrpcRequestMetadata, protectedServiceController, serviceController } from '.';

const mockRequest = { some: 'request' };
const mockResponse = { some: 'response' };
const mockError = new Error('Test error');
const mockMetadata = new Metadata();
const mockUser = { id: 'user-id' };

const mockHandleRequest = vi.fn().mockResolvedValue(mockResponse);
const mockHandleError = vi.fn().mockReturnValue(new Metadata());
const mockAuth = vi.fn().mockResolvedValue(mockUser);

const mockLogger = {
  child: vi.fn().mockReturnThis(),
  info: vi.fn(),
  error: vi.fn(),
} as unknown as Logger;

const mockCall = {
  request: mockRequest,
  metadata: mockMetadata,
  getPath: vi.fn().mockReturnValue('path'),
  getPeer: vi.fn().mockReturnValue('peer'),
  getHost: vi.fn().mockReturnValue('host'),
} as unknown as ServerUnaryCall<typeof mockRequest, typeof mockResponse>;

const mockCallback = vi.fn() as sendUnaryData<typeof mockResponse>;

beforeEach(() => {
  mockHandleRequest.mockClear();
  mockHandleError.mockClear();
  mockAuth.mockClear();
  // mockLogger.child.mockClear();
  // mockLogger.info.mockClear();
  // mockLogger.error.mockClear();
  // mockCall.getPath.mockClear();
  // mockCall.getPeer.mockClear();
  // mockCall.getHost.mockClear();
  // mockCallback.mockClear();
});

describe('createGrpcRequestMetadata', () => {
  it('should create metadata correctly', () => {
    const metadata = createGrpcRequestMetadata(mockCall, 'protectedServiceController');
    expect(metadata).toEqual({
      kind: 'grpc request',
      type: 'protectedServiceController',
      path: 'path',
      peer: 'peer',
      host: 'host',
      request: mockRequest,
      metadata: mockMetadata.toJSON(),
    });
  });
});

describe('protectedServiceController', () => {
  it('should handle request successfully', async () => {
    const controller = protectedServiceController<unknown, typeof mockResponse, typeof mockUser>(mockHandleRequest, mockHandleError, mockAuth, mockLogger);

    await controller(mockCall, mockCallback);

    expect(mockLogger.child).toHaveBeenCalled();
    expect(mockAuth).toHaveBeenCalledWith(mockMetadata);
    expect(mockHandleRequest).toHaveBeenCalledWith(mockRequest, mockUser, mockLogger);
    expect(mockCallback).toHaveBeenCalledWith(null, mockResponse);
  });

  it('should handle authentication error', async () => {
    const authError = new Error('Auth error');
    mockAuth.mockRejectedValueOnce(authError);

    const controller = protectedServiceController<unknown, typeof mockResponse, typeof mockUser>(mockHandleRequest, mockHandleError, mockAuth, mockLogger);

    await controller(mockCall, mockCallback);

    expect(mockLogger.child).toHaveBeenCalled();
    expect(mockAuth).toHaveBeenCalledWith(mockMetadata);
    expect(mockHandleRequest).not.toHaveBeenCalled();
    expect(mockCallback).toHaveBeenCalledWith({ code: status.INTERNAL, details: 'Internal Server Error', metadata: mockHandleError(authError) }, null);
  });

  it('should handle request processing error', async () => {
    mockHandleRequest.mockRejectedValueOnce(mockError);

    const controller = protectedServiceController<unknown, typeof mockResponse, typeof mockUser>(mockHandleRequest, mockHandleError, mockAuth, mockLogger);

    await controller(mockCall, mockCallback);

    expect(mockLogger.child).toHaveBeenCalled();
    expect(mockAuth).toHaveBeenCalledWith(mockMetadata);
    expect(mockHandleRequest).toHaveBeenCalledWith(mockRequest, mockUser, mockLogger);
    expect(mockCallback).toHaveBeenCalledWith({ code: status.INTERNAL, details: 'Internal Server Error', metadata: mockHandleError(mockError) }, null);
  });
});

describe('serviceController', () => {
  it('should handle request successfully', async () => {
    const controller = serviceController<unknown, typeof mockResponse>(mockHandleRequest, mockHandleError, mockLogger);

    await controller(mockCall, mockCallback);

    expect(mockLogger.child).toHaveBeenCalled();
    expect(mockHandleRequest).toHaveBeenCalledWith(mockRequest, mockLogger);
    expect(mockCallback).toHaveBeenCalledWith(null, mockResponse);
  });

  it('should handle request processing error', async () => {
    mockHandleRequest.mockRejectedValueOnce(mockError);

    const controller = serviceController<unknown, typeof mockResponse>(mockHandleRequest, mockHandleError, mockLogger);

    await controller(mockCall, mockCallback);

    expect(mockLogger.child).toHaveBeenCalled();
    expect(mockHandleRequest).toHaveBeenCalledWith(mockRequest, mockLogger);
    expect(mockCallback).toHaveBeenCalledWith({ code: status.INTERNAL, details: 'Internal Server Error', metadata: mockHandleError(mockError) }, null);
  });
});
