import { FilterQuery } from 'mongoose';
import { PaginatedResult, PaginationOptions, UserCreateInput, UserEntity, UserUpdateInput } from './user.types';

export interface UserRepository {
  getUser: (id: string) => Promise<UserEntity | null>;
  getUserByEmail: (email: string) => Promise<UserEntity | null>;
  listUsers: (filter: FilterQuery<UserEntity>) => Promise<UserEntity[]>;
  paginateUsers: (filter: FilterQuery<UserEntity>, options: PaginationOptions) => Promise<PaginatedResult<UserEntity>>;
  createUser: (user: UserCreateInput) => Promise<UserEntity>;
  updateUser: (id: string, user: UserUpdateInput) => Promise<UserEntity | null>;
  deleteUser: (id: string) => Promise<boolean>;
}
