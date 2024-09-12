import { IUser } from './entity';
import { IUserRepository } from './repository';

const users: IUser[] = [
  {
    id: '1',
    email: 'john.doe@example.com',
    photoUrl: 'https://example.com/john-doe.jpg',
    firstName: 'John',
    lastName: 'Doe',
    password: 'password',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    email: 'jane.doe@example.com',
    photoUrl: 'https://example.com/jane-doe.jpg',
    firstName: 'Jane',
    lastName: 'Doe',
    password: 'password',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    email: 'bob.smith@example.com',
    photoUrl: 'https://example.com/bob-smith.jpg',
    firstName: 'Bob',
    lastName: 'Smith',
    password: 'password',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    email: 'alice.johnson@example.com',
    photoUrl: 'https://example.com/alice-johnson.jpg',
    firstName: 'Alice',
    lastName: 'Johnson',
    password: 'password',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export function localUserUseCase(): IUserRepository {
  return {
    async getUser(id: string) {
      return users.find(user => user.id === id);
    },
    async listUsers() {
      return users;
    },
    async createUser(user) {
      const newUser = {
        ...user,
        id: String(users.length + 1),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      users.push(newUser);
      return newUser;
    },
    async updateUser(id, user) {
      const index = users.findIndex(user => user.id === id);
      if (index === -1) {
        throw new Error('User not found');
      }
      const updatedUser = {
        ...users[index],
        ...user,
        updatedAt: new Date(),
      };
      users[index] = updatedUser;
      return updatedUser;
    },
    async deleteUser(id) {
      const index = users.findIndex(user => user.id === id);
      if (index === -1) {
        throw new Error('User not found');
      }
      users.splice(index, 1);
    },
  };
}
