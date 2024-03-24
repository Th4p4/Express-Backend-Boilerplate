import mongoose from 'mongoose';

import { Logger } from '@src/@types/logger';
import { tokenTypes } from '../models';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../../../utils/AppError';
import { IUserDoc } from '../../user/models';
import { IUserWithTokens } from '../../user/services/entities';
import { ITokenRepository } from '../repository/tokenRepository';
import { ITokenService } from './token.service';
import { IUserService } from '@src/components/user/services/user.service';

export interface IAuthServiceSignature {
  loginUserWithEmailAndPassword: (email: string, password: string) => Promise<IUserDoc>;
  logout: (refreshToken: string) => Promise<void>;
  refreshAuth: (refreshToken: string) => Promise<IUserWithTokens>;
  resetPassword: (resetPasswordToken: any, newPassword: string) => Promise<void>;
  changePassword: (userId: string, oldPassword: string, newPassword: string) => Promise<void>;
  verifyEmail: (verifyEmailToken: any) => Promise<IUserDoc | null>;
}
export type IAuthService = (logger: Logger) => IAuthServiceSignature;

export const authServiceBuilder = (
  tokenRepository: ITokenRepository,
  userService: IUserService,
  tokenService: ITokenService,
): IAuthService => {
  const authService = (logger: Logger) => {
    /**
     * Login with username and password
     * @param {string} email
     * @param {string} password
     * @returns {Promise<IUserDoc>}
     */
    const loginUserWithEmailAndPassword = async (
      email: string,
      password: string,
    ): Promise<IUserDoc> => {
      const user = await userService(logger).getUserByEmail(email);
      if (!user || !(await userService(logger).matchPassword(user,password))) {
        throw new BadRequestError('Incorrect email or password');
      }
      if (user.isSuspended) {
        throw new UnauthorizedError('You are suspended, Please contact admin');
      }
      return user;
    };

    /**
     * Logout
     * @param {string} refreshToken
     * @returns {Promise<void>}
     */
    const logout = async (refreshToken: string): Promise<void> => {
      const refreshTokenDoc = await tokenRepository.findOne({
        token: refreshToken,
        type: tokenTypes.REFRESH,
        blacklisted: false,
      });
      if (!refreshTokenDoc) {
        throw new NotFoundError('Not found');
      }
      await refreshTokenDoc.deleteOne();
    };

    /**
     * Refresh auth tokens
     * @param {string} refreshToken
     * @returns {Promise<IUserWithTokens>}
     */
    const refreshAuth = async (refreshToken: string): Promise<IUserWithTokens> => {
      try {
        const refreshTokenDoc = await tokenService(logger).verifyToken(
          refreshToken,
          tokenTypes.REFRESH,
        );
        const user = await userService(logger).getUserById(
          new mongoose.Types.ObjectId(refreshTokenDoc.user),
        );
        if (!user) {
          throw new Error();
        }
        await refreshTokenDoc.deleteOne();
        const tokens = await tokenService(logger).generateAuthTokens(user._id);
        return { user, tokens };
      } catch (error) {
        throw new UnauthorizedError('Please authenticate');
      }
    };

    /**
     * Reset password
     * @param {string} resetPasswordToken
     * @param {string} newPassword
     * @returns {Promise<void>}
     */
    const resetPassword = async (resetPasswordToken: any, newPassword: string): Promise<void> => {
      try {
        const resetPasswordTokenDoc = await tokenService(logger).verifyToken(
          resetPasswordToken,
          tokenTypes.RESET_PASSWORD,
        );
        const user = await userService(logger).getUserById(
          new mongoose.Types.ObjectId(resetPasswordTokenDoc.user),
        );
        if (!user) {
          throw new Error();
        }
        await userService(logger).updateUserById(user.id, { password: newPassword });
        await tokenRepository.delete({ user: user.id, type: tokenTypes.RESET_PASSWORD });
      } catch (error) {
        throw new UnauthorizedError('Password reset failed');
      }
    };

    /**
     * Change password
     * @param {string} userId
     * @param {string} oldPassword
     * @param {string} newPassword
     * @returns {Promise<void>}
     */
    const changePassword = async (
      userId: string,
      oldPassword: string,
      newPassword: string,
    ): Promise<void> => {
      const user = await userService(logger).getUserById(new mongoose.Types.ObjectId(userId));
      if (!user) {
        throw new Error('User not found');
      }
      if (oldPassword === newPassword) {
        throw new BadRequestError('New password can not be old password');
      }
      if (!(await user.isPasswordMatch(oldPassword))) {
        throw new BadRequestError('Incorrect password');
      }
      await userService(logger).updateUserById(user.id, { password: newPassword });
    };

    /**
     * Verify email
     * @param {string} verifyEmailToken
     * @returns {Promise<IUserDoc | null>}
     */
    const verifyEmail = async (verifyEmailToken: any): Promise<IUserDoc | null> => {
      try {
        const verifyEmailTokenDoc = await tokenService(logger).verifyToken(
          verifyEmailToken,
          tokenTypes.VERIFY_EMAIL,
        );
        const user = await userService(logger).getUserById(
          new mongoose.Types.ObjectId(verifyEmailTokenDoc.user),
        );
        if (!user) {
          throw new Error();
        }
        await tokenRepository.delete({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
        const updatedUser = await userService(logger).updateUserById(user.id, {
          isEmailVerified: true,
        });
        return updatedUser;
      } catch (error) {
        throw new UnauthorizedError('Email verification failed');
      }
    };

    return {
      loginUserWithEmailAndPassword,
      logout,
      refreshAuth,
      resetPassword,
      changePassword,
      verifyEmail,
    };
  };
  return authService;
};
