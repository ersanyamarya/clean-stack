import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { createUserMongoRepository } from './user.mongodb.repository';
import { UserCreateInput, UserEntity } from './user.types';

describe('UserMongoRepository', () => {
  let mongoServer: MongoMemoryServer;
  let repository: ReturnType<typeof createUserMongoRepository>;
  let connection: mongoose.Connection;

  const mockUser: UserCreateInput = {
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    password: 'password123',
  };

  // Helper function to pick only relevant fields for comparison
  const pickUserFields = (user: UserEntity | UserCreateInput | null) => {
    if (!user) return null;
    const { email, firstName, lastName } = user;
    return { email, firstName, lastName };
  };

  beforeAll(async () => {
    // Arrange
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

  describe('when creating a user', () => {
    it('creates and returns a new user with all fields', async () => {
      // Act
      const user = await repository.createUser(mockUser);

      // Assert
      expect(pickUserFields(user)).toEqual(pickUserFields(mockUser));
      expect(user._id).toBeDefined();
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
    });

    it('excludes password when converting to JSON', async () => {
      // Act
      const user = await repository.createUser(mockUser);
      const userJSON = JSON.parse(JSON.stringify(user));

      // Assert
      expect(userJSON.password).toBeUndefined();
    });

    it('throws ResourceAlreadyExists when email is duplicate', async () => {
      // Arrange
      await repository.createUser(mockUser);

      // Act & Assert
      await expect(repository.createUser(mockUser)).rejects.toThrow(mongoose.mongo.MongoError);
      await expect(repository.createUser(mockUser)).rejects.toThrow(/duplicate key error/i);
    });

    it('throws ValidationError when required fields are missing', async () => {
      // Arrange
      const invalidUser = { email: 'test@example.com' } as UserCreateInput;

      // Act & Assert
      await expect(repository.createUser(invalidUser)).rejects.toThrow();
    });
  });

  describe('when retrieving a user', () => {
    describe('by ID', () => {
      it('returns the user when found', async () => {
        // Arrange
        const created = await repository.createUser(mockUser);

        // Act
        const user = await repository.getUser(created._id.toString());

        // Assert
        expect(pickUserFields(user)).toEqual(pickUserFields(mockUser));
      });

      it('returns null when user does not exist', async () => {
        // Arrange
        const nonExistentId = new mongoose.Types.ObjectId().toString();

        // Act
        const user = await repository.getUser(nonExistentId);

        // Assert
        expect(user).toBeNull();
      });
    });

    describe('by email', () => {
      it('returns the user when found', async () => {
        // Arrange
        await repository.createUser(mockUser);

        // Act
        const user = await repository.getUserByEmail(mockUser.email);

        // Assert
        expect(pickUserFields(user)).toEqual(pickUserFields(mockUser));
      });

      it('returns null when email does not exist', async () => {
        // Act
        const user = await repository.getUserByEmail('nonexistent@example.com');

        // Assert
        expect(user).toBeNull();
      });
    });
  });

  describe('when listing users', () => {
    it('returns all users when no filter is provided', async () => {
      // Arrange
      await repository.createUser(mockUser);
      await repository.createUser({ ...mockUser, email: 'test2@example.com' });

      // Act
      const users = await repository.listUsers({});

      // Assert
      expect(users).toHaveLength(2);
    });

    it('returns filtered users when filter is provided', async () => {
      // Arrange
      await repository.createUser(mockUser);
      await repository.createUser({ ...mockUser, email: 'test2@example.com' });

      // Act
      const users = await repository.listUsers({ email: mockUser.email });

      // Assert
      expect(users).toHaveLength(1);
      expect(pickUserFields(users[0])).toEqual(pickUserFields(mockUser));
    });
  });

  describe('when paginating users', () => {
    beforeEach(async () => {
      // Arrange: Create test users
      await Promise.all([
        repository.createUser(mockUser),
        repository.createUser({ ...mockUser, email: 'test2@example.com' }),
        repository.createUser({ ...mockUser, email: 'test3@example.com' }),
      ]);
    });

    it('returns correct page of users with total counts', async () => {
      // Act
      const result = await repository.paginateUsers({}, { page: 1, limit: 2 });

      // Assert
      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(3);
      expect(result.totalPages).toBe(2);
    });

    it('handles empty result sets correctly', async () => {
      // Act
      const result = await repository.paginateUsers({ email: 'nonexistent@example.com' }, { page: 1, limit: 10 });

      // Assert
      expect(result.data).toHaveLength(0);
      expect(result.total).toBe(0);
      expect(result.totalPages).toBe(0);
    });

    it('returns empty array for page numbers beyond total pages', async () => {
      // Act
      const result = await repository.paginateUsers({}, { page: 999, limit: 10 });

      // Assert
      expect(result.data).toHaveLength(0);
      expect(result.total).toBe(3);
      expect(result.totalPages).toBe(1);
    });

    it('handles special characters in filter criteria', async () => {
      // Arrange
      await repository.createUser({
        ...mockUser,
        firstName: 'Test$Special',
        email: 'special@example.com',
      });

      // Act
      const result = await repository.paginateUsers({ firstName: 'Test$Special' }, { page: 1, limit: 10 });

      // Assert
      expect(result.data).toHaveLength(1);
      expect(result.data[0].firstName).toBe('Test$Special');
    });
  });

  describe('when updating a user', () => {
    it('updates and returns the modified user', async () => {
      // Arrange
      const created = await repository.createUser(mockUser);

      // Act
      const updated = await repository.updateUser(created._id.toString(), {
        firstName: 'Updated',
      });

      // Assert
      expect(updated?.firstName).toBe('Updated');
      expect(updated?.email).toBe(mockUser.email);
    });

    it('returns null when user does not exist', async () => {
      // Arrange
      const nonExistentId = new mongoose.Types.ObjectId().toString();

      // Act
      const updated = await repository.updateUser(nonExistentId, { firstName: 'Updated' });

      // Assert
      expect(updated).toBeNull();
    });
  });

  describe('when deleting a user', () => {
    it('removes the user and returns true', async () => {
      // Arrange
      const created = await repository.createUser(mockUser);

      // Act
      const result = await repository.deleteUser(created._id.toString());

      // Assert
      expect(result).toBe(true);
      const user = await repository.getUser(created._id.toString());
      expect(user).toBeNull();
    });

    it('returns false when user does not exist', async () => {
      // Arrange
      const nonExistentId = new mongoose.Types.ObjectId().toString();

      // Act
      const result = await repository.deleteUser(nonExistentId);

      // Assert
      expect(result).toBe(false);
    });
  });
});
