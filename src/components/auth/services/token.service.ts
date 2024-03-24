import jwt from 'jsonwebtoken';
import moment, { Moment } from 'moment';
import mongoose from 'mongoose';

import config from '../../../config/config';
import { ITokenDoc, tokenTypes } from '../models';
import { BadRequestError, NotFoundError } from '../../../utils/AppError';
import { AccessAndRefreshTokens } from './entities';
import { Logger } from '@src/@types/logger';
import { ITokenRepository } from '../repository/tokenRepository';
import { IUserRepository } from '@src/components/user/repository/userRepository';

export interface ITokenServiceSignature {
  verifyToken: (token: string, type: string) => Promise<ITokenDoc>;
  generateAuthTokens: (userId: mongoose.Types.ObjectId) => Promise<AccessAndRefreshTokens>;
  generateResetPasswordToken: (email: string) => Promise<string>;
  generateVerifyEmailToken: (userId: mongoose.Types.ObjectId) => Promise<string>;
}
export type ITokenService = (logger: Logger) => ITokenServiceSignature;

export const tokenServiceBuilder = (
  tokenRepository: ITokenRepository,
  userRepository: IUserRepository,
): ITokenService => {
  const tokenService = (_logger: Logger) => {
    /**
     * Generate token
     * @param {mongoose.Types.ObjectId} userId
     * @param {Moment} expires
     * @param {string} type
     * @param {string} [secret]
     * @returns {string}
     */
    const generateToken = (
      userId: mongoose.Types.ObjectId,
      expires: Moment,
      type: string,
      secret: string = config.jwt.secret,
    ): string => {
      const payload = {
        sub: userId,
        iat: moment().unix(),
        exp: expires.unix(),
        type,
      };
      return jwt.sign(payload, secret);
    };

    /**
     * Save a token
     * @param {string} token
     * @param {mongoose.Types.ObjectId} userId
     * @param {Moment} expires
     * @param {string} type
     * @param {boolean} [blacklisted]
     * @returns {Promise<ITokenDoc>}
     */
    const saveToken = async (
      token: string,
      userId: mongoose.Types.ObjectId,
      expires: Moment,
      type: string,
      blacklisted: boolean = false,
    ): Promise<ITokenDoc> => {
      const tokenDoc = await tokenRepository.saveToken(token, userId, expires, type, blacklisted);
      return tokenDoc;
    };

    /**
     * Verify token and return token doc (or throw an error if it is not valid)
     * @param {string} token
     * @param {string} type
     * @returns {Promise<ITokenDoc>}
     */
    const verifyToken = async (token: string, type: string): Promise<ITokenDoc> => {
      const payload = jwt.verify(token, config.jwt.secret);
      if (typeof payload.sub !== 'string') {
        throw new BadRequestError('bad user');
      }
      const tokenDoc = await tokenRepository.findOne({
        token,
        type,
        user: payload.sub,
        blacklisted: false,
      });
      if (!tokenDoc) {
        throw new Error('Token not found');
      }
      return tokenDoc;
    };

    /**
     * Generate auth tokens
     * @returns {Promise<AccessAndRefreshTokens>}
     */
    const generateAuthTokens = async (
      userId: mongoose.Types.ObjectId,
    ): Promise<AccessAndRefreshTokens> => {
      const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
      const accessToken = generateToken(userId, accessTokenExpires, tokenTypes.ACCESS);

      const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
      const refreshToken = generateToken(userId, refreshTokenExpires, tokenTypes.REFRESH);
      await saveToken(refreshToken, userId, refreshTokenExpires, tokenTypes.REFRESH);

      return {
        access: {
          token: accessToken,
          expires: accessTokenExpires.toDate(),
        },
        refresh: {
          token: refreshToken,
          expires: refreshTokenExpires.toDate(),
        },
      };
    };

    /**
     * Generate reset password token
     * @param {string} email
     * @returns {Promise<string>}
     */
    const generateResetPasswordToken = async (email: string): Promise<string> => {
      const user = await userRepository.getUserByEmail(email);
      if (!user) {
        throw new NotFoundError('User not found');
      }
      const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
      const resetPasswordToken = generateToken(user.id, expires, tokenTypes.RESET_PASSWORD);
      await saveToken(resetPasswordToken, user.id, expires, tokenTypes.RESET_PASSWORD);
      return resetPasswordToken;
    };

    /**
     * Generate verify email token
     * @param {IUserDoc} user
     * @returns {Promise<string>}
     */
    const generateVerifyEmailToken = async (userId: mongoose.Types.ObjectId): Promise<string> => {
      const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
      const verifyEmailToken = generateToken(userId, expires, tokenTypes.VERIFY_EMAIL);
      await saveToken(verifyEmailToken, userId, expires, tokenTypes.VERIFY_EMAIL);
      return verifyEmailToken;
    };

    return {
      generateToken,
      saveToken,
      verifyToken,
      generateAuthTokens,
      generateResetPasswordToken,
      generateVerifyEmailToken,
    };
  };
  return tokenService;
};
