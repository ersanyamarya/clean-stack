import { ISafeUser, IUpdateUser, IUser } from './entity';

export type IUserRepository = {
  getUser: (id: string) => Promise<ISafeUser | undefined>;
  listUsers: () => Promise<ISafeUser[]>;
  createUser: (user: IUser) => Promise<ISafeUser>;
  updateUser: (id: string, user: IUpdateUser) => Promise<ISafeUser>;
  deleteUser: (id: string) => Promise<void>;
};
