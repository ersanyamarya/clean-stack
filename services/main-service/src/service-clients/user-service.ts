import { ServiceUserClient } from '@clean-stack/grpc-proto';
import { credentials } from '@grpc/grpc-js';

const USER_SERVICE_ADDRESS = 'localhost:9901';

let user_service_client: ServiceUserClient;

export default {
  connect: () => {
    user_service_client = new ServiceUserClient(USER_SERVICE_ADDRESS, credentials.createInsecure());
  },
  close: () => user_service_client.close(),
  name: 'user-service',
  address: USER_SERVICE_ADDRESS,
};

export const listUsers = () => user_service_client.listUsers.bind(user_service_client);
