import { Metadata, sendUnaryData, ServerUnaryCall, status } from '@grpc/grpc-js';

export type ServiceController<Request, Response> = (call: ServerUnaryCall<Request, Response>, callback: sendUnaryData<Response>) => void;

export type ServiceControllerErrorHandler = (error: unknown) => Metadata;
export type ServiceControllerAuth<User> = (metadata: Metadata) => Promise<User>;
export type ProtectedServiceControllerHandler<Request, Response, User> = (request: Request, user: User) => Promise<Response>;
export type ServiceControllerHandler<Request, Response> = (request: Request) => Promise<Response>;

/**
 * The function `protectedServiceController` handles requests with authentication and error handling in
 * a TypeScript service controller.
 * @param handleRequest - The `handleRequest` parameter in the `protectedServiceController` function is
 * a function that handles the request processing for a protected service. It takes three generic
 * types: `Request` for the request type, `Response` for the response type, and `User` for the user
 * type. This function is
 * @param {ServiceControllerErrorHandler} handleError - The `handleError` parameter in the
 * `protectedServiceController` function is a function that handles errors that occur during the
 * processing of a request in the service controller. It is responsible for transforming the error into
 * a format that can be sent back to the client. The `handleError` function takes the
 * @param auth - The `auth` parameter in the `protectedServiceController` function is a function that
 * takes the metadata from the gRPC call and returns a user object. This function is responsible for
 * authenticating the user making the request to the service.
 * @returns The `protectedServiceController` function returns a ServiceController that handles requests
 * with authentication and error handling. It takes a handler function for processing requests, an
 * error handler function, and an authentication function as parameters. The returned ServiceController
 * is an asynchronous function that authenticates the user, processes the request using the handler
 * function, and handles any errors that occur during the process.
 */
export function protectedServiceController<Request, Response, User>(
  handleRequest: ProtectedServiceControllerHandler<Request, Response, User>,
  handleError: ServiceControllerErrorHandler,
  auth: ServiceControllerAuth<User>
): ServiceController<Request, Response> {
  return async (call: ServerUnaryCall<Request, Response>, callback: sendUnaryData<Response>) => {
    try {
      const user = await auth(call.metadata);

      const response = await handleRequest(call.request, user);

      callback(null, response);
    } catch (error) {
      callback({ code: status.INTERNAL, details: 'Internal Server Error', metadata: handleError(error) }, null);
    }
  };
}

/**
 * The function `serviceController` is a TypeScript function that handles service requests and errors
 * in a server-side application.
 * @param handleRequest - The `handleRequest` parameter in the `serviceController` function is a
 * function that handles the incoming request and returns a response. It has the following signature:
 * @param {ServiceControllerErrorHandler} errorHandler - The `errorHandler` parameter in the
 * `serviceController` function is a function that takes an error as input and returns metadata to be
 * sent back in the gRPC response when an error occurs during the handling of a request. This metadata
 * can include additional information about the error to help the client understand what
 * @returns The `serviceController` function returns a ServiceController function that takes a
 * ServerUnaryCall object and a sendUnaryData callback as parameters. Inside this function, it handles
 * the request by calling the `handleRequest` function with the request from the call object. If
 * successful, it sends the response back using the callback. If an error occurs, it sends an error
 * response with status code INTERNAL and error details '
 */
export function serviceController<Request, Response>(
  handleRequest: ServiceControllerHandler<Request, Response>,
  errorHandler: ServiceControllerErrorHandler
): ServiceController<Request, Response> {
  return async (call: ServerUnaryCall<Request, Response>, callback: sendUnaryData<Response>) => {
    try {
      const response = await handleRequest(call.request);
      callback(null, response);
    } catch (error) {
      callback({ code: status.INTERNAL, details: 'Internal Server Error', metadata: errorHandler(error) }, null);
    }
  };
}
