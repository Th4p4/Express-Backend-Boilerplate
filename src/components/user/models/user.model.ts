import mongoose, { Model, Document } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

import toJSON from '../../../helpers/toJSON/toJSON';
import paginate, { QueryResult } from '../../../helpers/paginate/paginate';
import { roles } from '../../../config/roles';
import { IUser } from '../services/entities';

export interface IUserDoc extends IUser, Document {
  isPasswordMatch(password: string): Promise<boolean>;
}

export interface IUserModel extends Model<IUserDoc> {
  isEmailTaken(email: string, excludeUserId?: mongoose.Types.ObjectId): Promise<boolean>;
  isUsernameTaken(username: string, excludeUserId?: mongoose.Types.ObjectId): Promise<boolean>;
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export const userModelBuilder = (): IUserModel => {
  const userSchema = new mongoose.Schema<IUserDoc, IUserModel>(
    {
      username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value: string) {
          if (!value.match(/^[\da-z_]+$/) || (value.match(/_/g) || []).length > 1) {
            throw new Error(
              'Username can only contain lowercase alphanumeric characters and an underscore',
            );
          }
        },
      },
      email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value: string) {
          if (!validator.isEmail(value)) {
            throw new Error('Invalid email');
          }
        },
      },
      password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
        validate(value: string) {
          if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
            throw new Error('Password must contain at least one letter and one number');
          }
        },
        private: true, // used by the toJSON plugin
      },
      role: {
        type: String,
        enum: roles,
        default: 'user',
      },
      isEmailVerified: {
        type: Boolean,
        default: false,
      },
      lastLoggedinDate: {
        type: Date,
        required: true,
        default: new Date(),
      },
      isSuspended: {
        type: Boolean,
        required: true,
        default: false,
      },
    },
    {
      timestamps: true,
    },
  );

  // add plugin that converts mongoose to json
  userSchema.plugin(toJSON);
  userSchema.plugin(paginate);

  /**
   * Check if email is taken
   * @param {string} email - The user's email
   * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
   * @returns {Promise<boolean>}
   */
  userSchema.static(
    'isEmailTaken',
    async function (email: string, excludeUserId: mongoose.ObjectId): Promise<boolean> {
      const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
      return !!user;
    },
  );

  /**
   * Check if username is taken
   * @param {string} username - The user's username
   * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
   * @returns {Promise<boolean>}
   */
  userSchema.static(
    'isUsernameTaken',
    async function (username: string, excludeUserId: mongoose.ObjectId): Promise<boolean> {
      const user = await this.findOne({ username, _id: { $ne: excludeUserId } });
      return !!user;
    },
  );

  /**
   * Check if password matches the user's password
   * @param {string} password
   * @returns {Promise<boolean>}
   */
  userSchema.method('isPasswordMatch', async function (password: string): Promise<boolean> {
    const user = this;
    return bcrypt.compare(password, user.password);
  });

  userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
      user.password = await bcrypt.hash(user.password, 8);
    }
    next();
  });

  const User = mongoose.model<IUserDoc, IUserModel>('User', userSchema);

  return User;
};
