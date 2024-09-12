import { errorHandler } from '@clean-stack/custom-errors';
import { localUserUseCase } from '@clean-stack/domain_user';
import { Logger } from '@clean-stack/global_types';
import { ServiceControllerErrorHandler } from '@clean-stack/grpc-essentials';
import { ServiceUserService } from '@clean-stack/grpc-proto';
import { Metadata, Server, ServerCredentials } from '@grpc/grpc-js';
import { userServiceServer } from './service';
const HOST = process.env.HOST || '0.0.0.0';
const PORT = Number(process.env.PORT) || 50051;

const address = `${HOST}:${PORT}`;

const ConsoleTextColorLogger: Logger = {
  info: (...optionalParams: unknown[]) => console.log('\x1b[32m', 'ℹ️ ', ...optionalParams, '\x1b[0m'),
  warn: (...optionalParams: unknown[]) => console.log('\x1b[33m', '⚠️ ', ...optionalParams, '\x1b[0m'),
  error: (...optionalParams: unknown[]) => console.log('\x1b[31m', '❌ ', ...optionalParams, '\x1b[0m'),
  debug: (...optionalParams: unknown[]) => console.log('\x1b[34m', '🐛 ', ...optionalParams, '\x1b[0m'),
};

const server = new Server();

const handleError: ServiceControllerErrorHandler = (error, logger) => {
  logger.error(error);
  const metadata = new Metadata();
  const formattedError = errorHandler(error, logger);

  metadata.set('error-code', formattedError.errorCode);
  metadata.set('error-message', formattedError.message);

  return metadata;
};

const userUseCase = localUserUseCase();

try {
  const userService = userServiceServer(userUseCase, handleError, ConsoleTextColorLogger);

  server.addService(ServiceUserService, userService);
} catch (error) {
  console.log('----------------------------------> error <----------------------------------');

  ConsoleTextColorLogger.error(`Failed to add service: ${error}`);
}
server.bindAsync(address, ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    ConsoleTextColorLogger.error(`Failed to bind server to ${address}: ${err}`);
    process.exit(1);
  }

  ConsoleTextColorLogger.info(`Server bound on port ${port}`);
  ConsoleTextColorLogger.info(`Server listening on ${address}`);
});
