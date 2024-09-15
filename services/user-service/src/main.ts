import { AppLogger } from '@clean-stack/appLogger';
import { errorHandler } from '@clean-stack/custom-errors';
import { localUserUseCase } from '@clean-stack/domain_user';
import { ServiceControllerErrorHandler } from '@clean-stack/grpc-essentials';
import { ServiceUserService } from '@clean-stack/grpc-proto';
import { Metadata, Server, ServerCredentials } from '@grpc/grpc-js';
import { userServiceServer } from './service';

import { exceptions, gracefulShutdown } from '@clean-stack/utilities';
import { config, loadConfig } from './config';

const handleError: ServiceControllerErrorHandler = (error, logger) => {
  logger.error(error);
  const metadata = new Metadata();
  const formattedError = errorHandler(error, logger);

  metadata.set('error-code', formattedError.errorCode);
  metadata.set('error-message', formattedError.message);

  return metadata;
};

exceptions(AppLogger);

async function main() {
  loadConfig();
  const server = new Server();

  const userUseCase = localUserUseCase();

  const address = config.address;
  try {
    const userService = userServiceServer(userUseCase, handleError, AppLogger);

    server.addService(ServiceUserService, userService);
  } catch (error) {
    console.log('----------------------------------> error <----------------------------------');

    AppLogger.error(`Failed to add service: ${error}`);
  }
  server.bindAsync(address, ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      AppLogger.error(`Failed to bind server to ${address}: ${err}`);
      process.exit(1);
    }

    AppLogger.info(`Server bound on port ${port}`);
    AppLogger.info(`Server listening on ${address}`);
  });

  const onsShutdown = () => {
    AppLogger.info('Shutting down server');
    server.forceShutdown();
  };

  gracefulShutdown(AppLogger, onsShutdown);
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
