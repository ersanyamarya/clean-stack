import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { createUserMongoRepository } from './user.mongodb.repository';

describe('UserMongoRepository', () => {
  let mongoServer: MongoMemoryServer;
  let repository: ReturnType<typeof createUserMongoRepository>;
  let connection: mongoose.Connection;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    connection = mongoose.connection;
    repository = createUserMongoRepository(connection);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await connection.collection('users').deleteMany({});
  });

  const mockUser = {
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    password: 'password123',
  };

  // Helper function to pick only relevant fields for comparison
  const pickUserFields = (user: any) => {
    const { email, firstName, lastName } = user;
    return { email, firstName, lastName };
  };

  describe('createUser', () => {
    it('should create a new user', async () => {
      const user = await repository.createUser(mockUser);
      expect(pickUserFields(user)).toEqual(pickUserFields(mockUser));
      expect(user._id).toBeDefined();
    });

    it('should remove password when converting to JSON', async () => {
      const user = await repository.createUser(mockUser);
      const userJSON = JSON.parse(JSON.stringify(user));
      expect(userJSON.password).toBeUndefined();
    });
  });

  describe('getUser', () => {
    it('should return user by id', async () => {
      const created = await repository.createUser(mockUser);
      const user = await repository.getUser(created._id.toString());
      expect(pickUserFields(user)).toEqual(pickUserFields(mockUser));
    });

    it('should return null for non-existent id', async () => {
      const user = await repository.getUser(new mongoose.Types.ObjectId().toString());
      expect(user).toBeNull();
    });
  });

  describe('getUserByEmail', () => {
    it('should return user by email', async () => {
      await repository.createUser(mockUser);
      const user = await repository.getUserByEmail(mockUser.email);
      expect(pickUserFields(user)).toEqual(pickUserFields(mockUser));
    });

    it('should return null for non-existent email', async () => {
      const user = await repository.getUserByEmail('nonexistent@example.com');
      expect(user).toBeNull();
    });
  });

  describe('listUsers', () => {
    it('should list all users', async () => {
      await repository.createUser(mockUser);
      await repository.createUser({ ...mockUser, email: 'test2@example.com' });

      const users = await repository.listUsers({});
      expect(users).toHaveLength(2);
    });

    it('should filter users', async () => {
      await repository.createUser(mockUser);
      await repository.createUser({ ...mockUser, email: 'test2@example.com' });

      const users = await repository.listUsers({ email: mockUser.email });
      expect(users).toHaveLength(1);
      expect(pickUserFields(users[0])).toEqual(pickUserFields(mockUser));
    });
  });

  describe('paginateUsers', () => {
    it('should paginate users', async () => {
      const users = await Promise.all([
        repository.createUser(mockUser),
        repository.createUser({ ...mockUser, email: 'test2@example.com' }),
        repository.createUser({ ...mockUser, email: 'test3@example.com' }),
      ]);

      const result = await repository.paginateUsers({}, { page: 1, limit: 2 });
      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(3);
      expect(result.totalPages).toBe(2);
    });
  });

  describe('updateUser', () => {
    it('should update user', async () => {
      const created = await repository.createUser(mockUser);
      const updated = await repository.updateUser(created._id.toString(), {
        firstName: 'Updated',
      });
      expect(updated?.firstName).toBe('Updated');
      expect(updated?.email).toBe(mockUser.email);
    });

    it('should return null for non-existent id', async () => {
      const updated = await repository.updateUser(new mongoose.Types.ObjectId().toString(), { firstName: 'Updated' });
      expect(updated).toBeNull();
    });
  });

  describe('deleteUser', () => {
    it('should delete user', async () => {
      const created = await repository.createUser(mockUser);
      const result = await repository.deleteUser(created._id.toString());
      expect(result).toBe(true);

      const user = await repository.getUser(created._id.toString());
      expect(user).toBeNull();
    });

    it('should return false for non-existent id', async () => {
      const result = await repository.deleteUser(new mongoose.Types.ObjectId().toString());
      expect(result).toBe(false);
    });
  });
});
