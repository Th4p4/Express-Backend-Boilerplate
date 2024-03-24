import mongoose, { Model, Document } from 'mongoose';

import toJSON from '../../../helpers/toJSON/toJSON';
import { IToken } from '../services/entities';

export interface ITokenDoc extends IToken, Document {}

export interface ITokenModel extends Model<ITokenDoc> {}

export const tokenTypes = {
  ACCESS: 'access',
  REFRESH: 'refresh',
  RESET_PASSWORD: 'resetPassword',
  VERIFY_EMAIL: 'verifyEmail',
};

export const tokenModelBuilder = (): ITokenModel => {
  const tokenSchema = new mongoose.Schema<ITokenDoc, ITokenModel>(
    {
      token: {
        type: String,
        required: true,
        index: true,
      },
      user: {
        type: String,
        ref: 'User',
        required: true,
      },
      type: {
        type: String,
        enum: [tokenTypes.REFRESH, tokenTypes.RESET_PASSWORD, tokenTypes.VERIFY_EMAIL],
        required: true,
      },
      expires: {
        type: Date,
        required: true,
      },
      blacklisted: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    },
  );

  // add plugin that converts mongoose to json
  tokenSchema.plugin(toJSON);

  const Token = mongoose.model<ITokenDoc, ITokenModel>('Token', tokenSchema);

  return Token;
};
