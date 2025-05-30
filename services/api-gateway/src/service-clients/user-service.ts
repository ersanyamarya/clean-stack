import { ServiceUserClient } from '@clean-stack/grpc-proto/user';
import { credentials } from '@grpc/grpc-js';

import { config } from '../config';
const userServiceAddress = config.userServiceAddress;

let user_service_client: ServiceUserClient;

export default {
  initializeConnection: () => {
    user_service_client = new ServiceUserClient(userServiceAddress, credentials.createInsecure());
  },
  close: () => user_service_client.close(),
  name: 'user-service',
  address: userServiceAddress,
};

const checkClientInitialized = () => {
  if (!user_service_client) throw new Error('User service client is not initialized');
};

export const listUsers = () => {
  checkClientInitialized();
  return user_service_client.listUsers.bind(user_service_client);
};
