import { mainLogger, telemetrySdk } from './init';

import { errorHandler } from '@clean-stack/custom-errors';

import { ServiceLLMService } from '@clean-stack/grpc-proto/llm';
import { Metadata, Server, ServerCredentials } from '@grpc/grpc-js';

import { llmServiceServer } from './service';

import { ServiceControllerErrorHandler } from '@clean-stack/framework/grpc-essentials';
import { exceptions, gracefulShutdown } from '@clean-stack/framework/utilities';
import { config } from './config';

const handleError: ServiceControllerErrorHandler = error => {
  mainLogger.error(error);
  const metadata = new Metadata();
  const formattedError = errorHandler(error, (error: unknown) => {
    mainLogger.error(error);
  });

  metadata.set('error-code', formattedError.errorCode);
  metadata.set('error-message', formattedError.message.toString());

  return metadata;
};

async function main() {
  exceptions(mainLogger);

  const server = new Server();

  const address = config.address;
  try {
    const llmService = llmServiceServer(handleError, mainLogger);

    server.addService(ServiceLLMService, llmService);
  } catch (error) {
    mainLogger.error(`Failed to add service: ${error}`);
  }

  server.bindAsync(address, ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      mainLogger.error(`Failed to bind server to ${address}: ${err}`);
      process.exit(1);
    }
    mainLogger.info(`Service name: ${address}`);
  });

  const onShutdown = async () => {
    mainLogger.info('Shutting down server');
    server.forceShutdown();
    telemetrySdk.shutdown();
  };

  gracefulShutdown(mainLogger, onShutdown);
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
