import mongoose from 'mongoose';

import { NewCreatedUser, UpdateUserBody, NewRegisteredUser, IUser } from './entities';
import { IOptions, QueryResult } from '../../../helpers/paginate/paginate';
import { IUserDoc } from '../models';
import { Logger } from '@src/@types/logger';
import { IUserRepository } from '../repository/userRepository';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../../../utils/AppError';

export interface IUserServiceSignature {
  createUser: (userBody: NewCreatedUser) => Promise<IUserDoc>;
  registerUser: (userBody: NewRegisteredUser) => Promise<IUserDoc>;
  queryUsers: (
    query: string,
    filter: Record<string, any>,
    options: IOptions,
  ) => Promise<QueryResult>;
  getUserById: (id: mongoose.Types.ObjectId) => Promise<IUserDoc | null>;
  getUserByEmail: (email: string) => Promise<IUserDoc | null>;
  updateUserById: (
    userId: mongoose.Types.ObjectId,
    updateBody: UpdateUserBody,
  ) => Promise<IUserDoc | null>;
  deleteUserById: (userId: mongoose.Types.ObjectId) => Promise<IUserDoc | null>;
  matchPassword: (user: IUserDoc, password: string) => Promise<boolean>;
}

export type IUserService = (logger: Logger) => IUserServiceSignature;

export const userServiceBuilder = (repository: IUserRepository): IUserService => {
  const userService = (_logger: Logger) => {
    /**
     * Create a user
     * @param {NewCreatedUser} userBody
     * @returns {Promise<IUserDoc>}
     */
    const createUser = async (userBody: NewCreatedUser): Promise<IUserDoc> => {
      try {
        if (await repository.isUsernameTaken(userBody.username)) {
          throw new BadRequestError('Username already taken');
        }
        if (await repository.isEmailTaken(userBody.email)) {
          throw new BadRequestError('Email already taken');
        }

        const newUserBody: IUser = {
          ...userBody,
          isEmailVerified: false,
          lastLoggedinDate: new Date(),
          isSuspended: false,
        };
        return await repository.create(newUserBody);
      } catch (error) {
        throw error;
      }
    };

    /**
     * Register a user
     * @param {NewRegisteredUser} userBody
     * @returns {Promise<IUserDoc>}
     */
    const registerUser = async (userBody: NewRegisteredUser): Promise<IUserDoc> => {
      try {
        if (await repository.isUsernameTaken(userBody.username)) {
          throw new BadRequestError('Username already taken');
        }
        if (await repository.isEmailTaken(userBody.email)) {
          throw new BadRequestError('Email already taken');
        }
        const newUserBody: IUser = {
          ...userBody,
          role: 'user',
          isEmailVerified: false,
          lastLoggedinDate: new Date(),
          isSuspended: false,
        };
        return await repository.create(newUserBody);
      } catch (error) {
        throw error;
      }
    };

    /**
     * Query for users
     * @param {Object} filter - Mongo filter
     * @param {Object} options - Query options
     * @returns {Promise<QueryResult>}
     */
    const queryUsers = async (
      query: string,
      filter: Record<string, any>,
      options: IOptions,
    ): Promise<QueryResult> => {
      try {
        return await repository.queryUsers(query, filter, options);
      } catch (error) {
        throw error;
      }
    };

    /**
     * Get user by id
     * @param {mongoose.Types.ObjectId} id
     * @returns {Promise<IUserDoc | null>}
     */
    const getUserById = async (id: mongoose.Types.ObjectId): Promise<IUserDoc | null> =>
      await repository.getUserById(id);

    /**
     * Get user by email
     * @param {string} email
     * @returns {Promise<IUserDoc | null>}
     */
    const getUserByEmail = async (email: string): Promise<IUserDoc | null> =>
      await repository.getUserByEmail(email);

    /**
     * Update user by id
     * @param {mongoose.Types.ObjectId} userId
     * @param {UpdateUserBody} updateBody
     * @returns {Promise<IUserDoc | null>}
     */
    const updateUserById = async (
      userId: mongoose.Types.ObjectId,
      updateBody: UpdateUserBody,
    ): Promise<IUserDoc | null> => {
      const user = await getUserById(userId);
      if (!user) {
        throw new NotFoundError('User not found');
      }
      if (user.role == 'admin') {
        throw new UnauthorizedError('Cannot update another admin');
      }
      if (updateBody.username && (await repository.isUsernameTaken(updateBody.username))) {
        throw new BadRequestError('Username already taken');
      }
      if (updateBody.email && (await repository.isEmailTaken(updateBody.email))) {
        throw new BadRequestError('Email already taken');
      }
      Object.assign(user, updateBody);
      await user.save();
      return user;
    };

    /**
     * Delete user by id
     * @param {mongoose.Types.ObjectId} userId
     * @returns {Promise<IUserDoc | null>}
     */
    const deleteUserById = async (userId: mongoose.Types.ObjectId): Promise<IUserDoc | null> => {
      try {
        return await repository.deleteUserById(userId);
      } catch (error) {
        throw error;
      }
    };

    const matchPassword = async (user: IUserDoc, password: string): Promise<boolean> => {
      return await repository.matchPassword(user, password);
    };
    return {
      createUser,
      registerUser,
      queryUsers,
      getUserById,
      getUserByEmail,
      updateUserById,
      deleteUserById,
      matchPassword,
    };
  };
  return userService;
};
