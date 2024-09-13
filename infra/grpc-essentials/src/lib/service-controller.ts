import { Logger } from '@clean-stack/global_types';
import { Metadata, sendUnaryData, ServerUnaryCall, status } from '@grpc/grpc-js';

export type ServiceController<Request, Response> = (call: ServerUnaryCall<Request, Response>, callback: sendUnaryData<Response>) => void;

export type ServiceControllerErrorHandler = (error: unknown, logger: Logger) => Metadata;
export type ServiceControllerAuth<User> = (metadata: Metadata, logger: Logger) => Promise<User>;
export type ProtectedServiceControllerHandler<Request, Response, User> = (request: Request, user: User, logger: Logger) => Promise<Response>;
export type ServiceControllerHandler<Request, Response> = (request: Request, logger: Logger) => Promise<Response>;

/**
 * The function `protectedServiceController` handles requests with authentication and error handling in
 * TypeScript.
 * @param handleRequest - The `handleRequest` parameter in the `protectedServiceController` function is
 * a function that handles the request for a protected service. It takes three parameters:
 * @param {ServiceControllerErrorHandler} handleError - The `handleError` parameter in the
 * `protectedServiceController` function is a function that handles errors that occur during the
 * execution of the service controller. It takes the error that occurred and the logger as input
 * parameters, and it should return metadata that will be included in the error response sent back to
 * the
 * @param {Logger} logger - The `logger` parameter in the `protectedServiceController` function is used
 * for logging information and errors that occur during the execution of the service controller. It is
 * passed to the function to allow logging messages and errors to be captured and recorded for
 * debugging and monitoring purposes. The `logger` parameter is typically
 * @param auth - The `auth` parameter in the `protectedServiceController` function is a function that
 * takes the metadata from the gRPC call and a logger as input and returns a Promise that resolves to a
 * user object. This function is responsible for authenticating the user making the gRPC call.
 * @returns The `protectedServiceController` function is returning a ServiceController function that
 * takes a ServerUnaryCall and sendUnaryData as parameters. Inside this function, it tries to
 * authenticate the user using the provided auth function, then handles the request using the
 * handleRequest function with the authenticated user and logger. If successful, it sends the response
 * back using the callback function. If an error occurs, it sends an Internal
 */
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

/**
 * The function `serviceController` handles service requests, logging errors and responses.
 * @param handleRequest - The `handleRequest` parameter in the `serviceController` function is a
 * function that handles the incoming request and generates a response. It takes the request data and a
 * logger as input parameters and returns a response based on the request data.
 * @param {ServiceControllerErrorHandler} errorHandler - The `errorHandler` parameter in the
 * `serviceController` function is a function that handles errors that occur during the processing of a
 * request. It takes the error object and a logger as input parameters and returns metadata that can be
 * sent back to the client in case of an error. This function helps in
 * @param {Logger} logger - The `logger` parameter in the `serviceController` function is used for
 * logging information related to the service operation. It is typically an instance of a logger
 * utility that allows you to log messages, errors, and other relevant information during the execution
 * of the service. This helps in debugging, monitoring, and
 * @returns The `serviceController` function returns a ServiceController function that takes a
 * ServerUnaryCall and a sendUnaryData callback as parameters. Inside this ServiceController function,
 * it handles the request by calling the provided handleRequest function with the request and logger,
 * and then sends the response back using the callback. If an error occurs during the handling of the
 * request, it catches the error, generates an error response with
 */
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
