import { IUser, IUserRepository } from '@clean-stack/domain_user';
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
} from '@clean-stack/grpc-proto';

export function userServiceServer(userRepository: IUserRepository, errorHandler: ServiceControllerErrorHandler, logger: Logger): ServiceUserServer {
  return {
    getUser: serviceController<UserIdMessage, UserGenericResponse>(async request => {
      logger.info('Getting user');
      const user = await userRepository.getUser(request.id);
      return UserGenericResponse.fromJSON(user);
    }, errorHandler),

    createUser: serviceController<CreateUserRequest, CreateUserResponse>(async request => {
      logger.info('Creating user');
      const user = CreateUserRequest.toJSON(request) as IUser;
      const newUser = await userRepository.createUser(user);
      const response: CreateUserResponse = CreateUserResponse.fromJSON(newUser);
      return response;
    }, errorHandler),
    listUsers: serviceController<ListUsersRequest, ListUsersResponse>(async request => {
      logger.info('Listing users');
      const { page, limit } = request;

      const users = await userRepository.listUsers();

      const total = users.length;
      return { users: users.map(user => UserGenericResponse.fromJSON(user)), total };
    }, errorHandler),

    updateUser: serviceController<UpdateUserRequest, UserGenericResponse>(async request => {
      logger.info('Updating user');
      const user = UpdateUserRequest.toJSON(request) as IUser;
      const updatedUser = await userRepository.updateUser(request.id, user);
      return UserGenericResponse.fromJSON(updatedUser);
    }, errorHandler),
    deleteUser: serviceController<UserIdMessage, UserIdMessage>(async request => {
      logger.info('Deleting user');
      await userRepository.deleteUser(request.id);
      return { id: request.id };
    }, errorHandler),
  };
}
