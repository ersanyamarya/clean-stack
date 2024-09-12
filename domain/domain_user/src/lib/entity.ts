export type ISafeUser = {
  id: string;
  email: string;
  photoUrl: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
};

export type IUser = ISafeUser & {
  password: string;
};

export type ICreateUser = Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>;

export type IUpdateUser = Partial<ICreateUser>;
