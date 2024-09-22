import { mainLogger, telemetrySdk } from './init';

import { errorHandler } from '@clean-stack/custom-errors';
import { localUserUseCase } from '@clean-stack/domain_user';
import { ServiceControllerErrorHandler } from '@clean-stack/grpc-essentials';
import { ServiceUserService } from '@clean-stack/grpc-proto';
import { Metadata, Server, ServerCredentials } from '@grpc/grpc-js';

import { userServiceServer } from './service';

import { exceptions, gracefulShutdown } from '@clean-stack/utilities';
import { config } from './config';

const handleError: ServiceControllerErrorHandler = error => {
  mainLogger.error(error);
  const metadata = new Metadata();
  const formattedError = errorHandler(error, mainLogger);

  metadata.set('error-code', formattedError.errorCode);
  metadata.set('error-message', formattedError.message);

  return metadata;
};

async function main() {
  exceptions(mainLogger);

  const server = new Server();

  const userUseCase = localUserUseCase();

  const address = config.address;
  try {
    const userService = userServiceServer(userUseCase, handleError, mainLogger);

    server.addService(ServiceUserService, userService);
  } catch (error) {
    console.log('----------------------------------> error <----------------------------------');

    mainLogger.error(`Failed to add service: ${error}`);
  }
  server.bindAsync(address, ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      mainLogger.error(`Failed to bind server to ${address}: ${err}`);
      process.exit(1);
    }

    mainLogger.info(`Server bound on port ${port}`);
    mainLogger.info(`Server listening on ${address}`);
  });

  const onsShutdown = () => {
    mainLogger.info('Shutting down server');
    server.forceShutdown();
    telemetrySdk.shutdown();
  };

  gracefulShutdown(mainLogger, onsShutdown);
}

main().catch(error => {
  if (error instanceof Error) {
    console.error(error.message);
    process.exit(1);
  } else {
    console.error('An unknown error occurred');
    process.exit(1);
  }
});
