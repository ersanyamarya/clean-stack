import { ClientUnaryCall, Metadata, ServiceError } from '@grpc/grpc-js';

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
