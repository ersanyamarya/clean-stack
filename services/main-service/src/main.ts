import { Logger } from '@clean-stack/global_types';
import { grpcClientPromisify } from '@clean-stack/grpc-essentials';

import { ListUsersRequest, ListUsersResponse, ServiceUserClient } from '@clean-stack/grpc-proto';
import { credentials } from '@grpc/grpc-js';
const ConsoleTextColorLogger: Logger = {
  info: (...optionalParams: unknown[]) => console.log('\x1b[32m', 'ℹ️ ', ...optionalParams, '\x1b[0m'),
  warn: (...optionalParams: unknown[]) => console.log('\x1b[33m', '⚠️ ', ...optionalParams, '\x1b[0m'),
  error: (...optionalParams: unknown[]) => console.log('\x1b[31m', '❌ ', ...optionalParams, '\x1b[0m'),
  debug: (...optionalParams: unknown[]) => console.log('\x1b[34m', '🐛 ', ...optionalParams, '\x1b[0m'),
};

const USER_SERVICE_ADDRESS = 'localhost:9901';

async function main() {
  const client = new ServiceUserClient(USER_SERVICE_ADDRESS, credentials.createInsecure());
  console.log('-----------------> client <-----------------');
  const users = await grpcClientPromisify<ListUsersRequest, ListUsersResponse>(client.listUsers.bind(client))({ limit: 10, page: 1 });

  console.log('-----------------> users <----------------');

  ConsoleTextColorLogger.info('Users:', users);
}

main().catch(error => {
  if (error instanceof Error) {
    console.error(error.message);
    console.error(error.stack);
    process.exit(1);
  } else {
    console.error('An unknown error occurred');
    process.exit(1);
  }
});
