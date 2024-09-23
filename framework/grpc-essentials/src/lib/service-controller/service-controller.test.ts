import { Metadata, sendUnaryData, ServerUnaryCall, status } from '@grpc/grpc-js';
import { describe, expect, it, vi } from 'vitest';
import { protectedServiceController, serviceController } from '.';
describe('protectedServiceController', () => {
  const mockRequest = { some: 'request' };
  const mockResponse = { some: 'response' };
  const mockUser = { id: 'user-id' };
  const mockMetadata = new Metadata();
  const mockError = new Error('Test error');

  const mockHandleRequest = vi.fn().mockResolvedValue(mockResponse);
  const mockHandleError = vi.fn().mockReturnValue(new Metadata());
  const mockAuth = vi.fn().mockResolvedValue(mockUser);

  beforeEach(() => {
    mockHandleRequest.mockClear();
    mockHandleError.mockClear();
    mockAuth.mockClear();
  });

  const mockCall = {
    request: mockRequest,
    metadata: mockMetadata,
  } as unknown as ServerUnaryCall<typeof mockRequest, typeof mockResponse>;

  const mockCallback = vi.fn() as sendUnaryData<typeof mockResponse>;

  it('should handle request successfully', async () => {
    const controller = protectedServiceController<unknown, typeof mockResponse, typeof mockUser>(mockHandleRequest, mockHandleError, mockAuth);

    await controller(mockCall, mockCallback);

    expect(mockAuth).toHaveBeenCalledWith(mockMetadata);
    expect(mockHandleRequest).toHaveBeenCalledWith(mockRequest, mockUser);
    expect(mockCallback).toHaveBeenCalledWith(null, mockResponse);
  });

  it('should handle authentication error', async () => {
    const authError = new Error('Auth error');
    mockAuth.mockRejectedValueOnce(authError);

    const controller = protectedServiceController<unknown, typeof mockResponse, typeof mockUser>(mockHandleRequest, mockHandleError, mockAuth);

    await controller(mockCall, mockCallback);

    expect(mockAuth).toHaveBeenCalledWith(mockMetadata);
    expect(mockHandleRequest).not.toHaveBeenCalled();
    expect(mockCallback).toHaveBeenCalledWith({ code: status.INTERNAL, details: 'Internal Server Error', metadata: mockHandleError(authError) }, null);
  });

  it('should handle request processing error', async () => {
    mockHandleRequest.mockRejectedValueOnce(mockError);

    const controller = protectedServiceController<unknown, typeof mockResponse, typeof mockUser>(mockHandleRequest, mockHandleError, mockAuth);

    await controller(mockCall, mockCallback);

    expect(mockAuth).toHaveBeenCalledWith(mockMetadata);
    expect(mockHandleRequest).toHaveBeenCalledWith(mockRequest, mockUser);
    expect(mockCallback).toHaveBeenCalledWith({ code: status.INTERNAL, details: 'Internal Server Error', metadata: mockHandleError(mockError) }, null);
  });
});
describe('serviceController', () => {
  const mockRequest = { some: 'request' };
  const mockResponse = { some: 'response' };
  const mockError = new Error('Test error');

  const mockHandleRequest = vi.fn().mockResolvedValue(mockResponse);
  const mockHandleError = vi.fn().mockReturnValue(new Metadata());

  beforeEach(() => {
    mockHandleRequest.mockClear();
    mockHandleError.mockClear();
  });

  const mockCall = {
    request: mockRequest,
  } as unknown as ServerUnaryCall<typeof mockRequest, typeof mockResponse>;

  const mockCallback = vi.fn() as sendUnaryData<typeof mockResponse>;

  it('should handle request successfully', async () => {
    const controller = serviceController<unknown, typeof mockResponse>(mockHandleRequest, mockHandleError);

    await controller(mockCall, mockCallback);

    expect(mockHandleRequest).toHaveBeenCalledWith(mockRequest);
    expect(mockCallback).toHaveBeenCalledWith(null, mockResponse);
  });

  it('should handle request processing error', async () => {
    mockHandleRequest.mockRejectedValueOnce(mockError);

    const controller = serviceController<unknown, typeof mockResponse>(mockHandleRequest, mockHandleError);

    await controller(mockCall, mockCallback);

    expect(mockHandleRequest).toHaveBeenCalledWith(mockRequest);
    expect(mockCallback).toHaveBeenCalledWith({ code: status.INTERNAL, details: 'Internal Server Error', metadata: mockHandleError(mockError) }, null);
  });
});
