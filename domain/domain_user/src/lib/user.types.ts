import { Types } from 'mongoose';

export type UserEntity = {
  _id: Types.ObjectId;
  email: string;
  photoUrl?: string;
  firstName: string;
  lastName: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UserCreateInput = Omit<UserEntity, '_id' | 'createdAt' | 'updatedAt'>;
export type UserUpdateInput = Partial<Omit<UserEntity, '_id' | 'createdAt' | 'updatedAt'>>;

export type UserFilter = {
  email?: string;
  firstName?: string;
  lastName?: string;
};

export type PaginationOptions = {
  page: number;
  limit: number;
};

export type PaginatedResult<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
