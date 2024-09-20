import { ClientUnaryCall, Metadata, ServiceError } from '@grpc/grpc-js';
/**
 * The function `grpcClientPromisify` converts a gRPC client method into a promisified version.
 * @param method - The `method` parameter is a function that takes a request of type `Request`, an
 * optional `metadata` of type `Metadata`, and an optional callback function that takes an error of
 * type `ServiceError` or `null` and a response of type `Response`. This function returns a `Client
 * @returns The `grpcClientPromisify` function returns a new function that takes a request and optional
 * metadata, and returns a Promise that resolves with the response from the gRPC method call.
 */

export function grpcClientPromisify<Request, Response>(
  method: (request: Request, metadata?: Metadata, callback?: (error: ServiceError | null, response: Response) => void) => ClientUnaryCall
): (request: Request, metadata?: Metadata) => Promise<Response> {
  return (request: Request, metadata?: Metadata) => {
    return new Promise((resolve, reject) => {
      if (!metadata) metadata = new Metadata();

      method(request, metadata, (error, response) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(response);
      });
    });
  };
}
