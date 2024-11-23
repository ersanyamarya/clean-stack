import { Connection, FilterQuery, Model, Types, models } from 'mongoose';
import { UserRepository } from './user.repository';
import { userSchema } from './user.schema';
import { PaginatedResult, PaginationOptions, UserCreateInput, UserEntity, UserUpdateInput } from './user.types';

export const createUserMongoRepository = (connection: Connection): UserRepository => {
  const UserModel: Model<UserEntity> = models['User'] || connection.model<UserEntity>('User', userSchema);

  const getUser = async (id: string): Promise<UserEntity | null> => {
    const objectId = new Types.ObjectId(id);
    return UserModel.findById(objectId).exec();
  };

  const getUserByEmail = async (email: string): Promise<UserEntity | null> => {
    return UserModel.findOne({ email }).exec();
  };

  const listUsers = async (filter: FilterQuery<UserEntity>): Promise<UserEntity[]> => {
    return UserModel.find(filter).exec();
  };

  const paginateUsers = async (filter: FilterQuery<UserEntity>, { page, limit }: PaginationOptions): Promise<PaginatedResult<UserEntity>> => {
    const [data, total] = await Promise.all([
      UserModel.find(filter)
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      UserModel.countDocuments(filter).exec(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  };

  const createUser = async (user: UserCreateInput): Promise<UserEntity> => {
    const newUser = new UserModel(user);
    return newUser.save();
  };

  const updateUser = async (id: string, user: UserUpdateInput): Promise<UserEntity | null> => {
    const objectId = new Types.ObjectId(id);
    return UserModel.findByIdAndUpdate(objectId, { $set: user }, { new: true }).exec();
  };

  const deleteUser = async (id: string): Promise<boolean> => {
    const objectId = new Types.ObjectId(id);
    const result = await UserModel.deleteOne({ _id: objectId }).exec();
    return result.deletedCount === 1;
  };

  return {
    getUser,
    getUserByEmail,
    listUsers,
    paginateUsers,
    createUser,
    updateUser,
    deleteUser,
  };
};
