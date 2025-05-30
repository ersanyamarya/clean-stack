import { ServiceError } from '@grpc/grpc-js';
export { defaultGrpcErrorCode, grpcErrorCodes } from './codes';

export function isGrpcServiceError(error: unknown): error is ServiceError {
  return (
    error instanceof Error &&
    'code' in error &&
    'details' in error &&
    typeof (error as ServiceError).code === 'number' &&
    typeof (error as ServiceError).details === 'string'
  );
}
