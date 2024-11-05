import { Schema } from 'mongoose';
import { UserEntity } from './user.types';

export const userSchema = new Schema<UserEntity>(
  {
    email: { type: String, required: true, unique: true },
    photoUrl: { type: String },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true, select: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        delete ret['password'];
        return ret;
      },
    },
  }
);
