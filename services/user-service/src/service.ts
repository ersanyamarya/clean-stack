import { UserCreateInput, UserRepository, UserUpdateInput } from '@clean-stack/domain_user';
import { Logger } from '@clean-stack/framework/global-types';
import { serviceController, ServiceControllerErrorHandler } from '@clean-stack/framework/grpc-essentials';
import {
  CreateUserRequest,
  CreateUserResponse,
  ListUsersRequest,
  ListUsersResponse,
  ServiceUserServer,
  UpdateUserRequest,
  UserGenericResponse,
  UserIdMessage,
} from '@clean-stack/grpc-proto/user';

export function userServiceServer(userRepository: UserRepository, errorHandler: ServiceControllerErrorHandler, logger: Logger): ServiceUserServer {
  return {
    getUser: serviceController<UserIdMessage, UserGenericResponse>(
      async (request, logger) => {
        logger.info('Getting user');
        const user = await userRepository.getUser(request.id);
        return UserGenericResponse.fromJSON(user);
      },
      errorHandler,
      logger
    ),

    createUser: serviceController<CreateUserRequest, CreateUserResponse>(
      async (request, logger) => {
        logger.info('Creating user');
        const user = CreateUserRequest.toJSON(request) as UserCreateInput;
        const newUser = await userRepository.createUser(user);
        const response: CreateUserResponse = CreateUserResponse.fromJSON(newUser);
        return response;
      },
      errorHandler,
      logger
    ),
    listUsers: serviceController<ListUsersRequest, ListUsersResponse>(
      async (request, logger) => {
        logger.info('Listing users');
        const { page, limit } = request;

        const users = await userRepository.listUsers({});

        const total = users.length;
        return { users: users.map(user => UserGenericResponse.fromJSON(user)), total };
      },
      errorHandler,
      logger
    ),

    updateUser: serviceController<UpdateUserRequest, UserGenericResponse>(
      async (request, logger) => {
        logger.info('Updating user');
        const user = UpdateUserRequest.toJSON(request) as UserUpdateInput;
        const updatedUser = await userRepository.updateUser(request.id, user);
        return UserGenericResponse.fromJSON(updatedUser);
      },
      errorHandler,
      logger
    ),
    deleteUser: serviceController<UserIdMessage, UserIdMessage>(
      async (request, logger) => {
        logger.info('Deleting user');
        await userRepository.deleteUser(request.id);
        return { id: request.id };
      },
      errorHandler,
      logger
    ),
  };
}
