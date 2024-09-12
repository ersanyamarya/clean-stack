import { Logger } from '@clean-stack/global_types';
import { Metadata, sendUnaryData, ServerUnaryCall, status } from '@grpc/grpc-js';

export type ServiceController<Request, Response> = (call: ServerUnaryCall<Request, Response>, callback: sendUnaryData<Response>) => void;

export type ServiceControllerErrorHandler = (error: unknown, logger: Logger) => Metadata;
export type ServiceControllerAuth<User> = (metadata: Metadata, logger: Logger) => Promise<User>;
export type ProtectedServiceControllerHandler<Request, Response, User> = (request: Request, user: User, logger: Logger) => Promise<Response>;
export type ServiceControllerHandler<Request, Response> = (request: Request, logger: Logger) => Promise<Response>;

export function protectedServiceController<Request, Response, User>(
  handleRequest: ProtectedServiceControllerHandler<Request, Response, User>,
  handleError: ServiceControllerErrorHandler,
  logger: Logger,
  auth: ServiceControllerAuth<User>
): ServiceController<Request, Response> {
  return async (call: ServerUnaryCall<Request, Response>, callback: sendUnaryData<Response>) => {
    try {
      const user = await auth(call.metadata, logger);
      const response = await handleRequest(call.request, user, logger);
      callback(null, response);
    } catch (error) {
      callback({ code: status.INTERNAL, details: 'Internal Server Error', metadata: handleError(error, logger) }, null);
    }
  };
}

export function serviceController<Request, Response>(
  handleRequest: ServiceControllerHandler<Request, Response>,
  errorHandler: ServiceControllerErrorHandler,
  logger: Logger
): ServiceController<Request, Response> {
  return async (call: ServerUnaryCall<Request, Response>, callback: sendUnaryData<Response>) => {
    try {
      const response = await handleRequest(call.request, logger);
      callback(null, response);
    } catch (error) {
      callback({ code: status.INTERNAL, details: 'Internal Server Error', metadata: errorHandler(error, logger) }, null);
    }
  };
}
