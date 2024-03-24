import Joi from 'joi';
import {
  username,
  password,
  objectId,
  walletAddress,
} from '../../../helpers/validate/custom.validation';
import { NewCreatedUser } from '../services/entities';

const createUserBody: Record<keyof NewCreatedUser, any> = {
  email: Joi.string().required().email(),
  password: Joi.string().required().custom(password),
  username: Joi.string().required().custom(username),
  role: Joi.string().required().valid('user', 'admin'),
};

export const createUser = {
  body: Joi.object().keys(createUserBody),
};

const linkWalletBody = {
  message: Joi.string().required(),
  signature: Joi.string().required(),
  name: Joi.string(),
  isDefault: Joi.boolean(),
};

export const linkWallet = {
  body: Joi.object().keys(linkWalletBody),
};

export const deleteOrUpdateDefaultWallet = {
  body: Joi.object().keys({
    address: Joi.string().required().custom(walletAddress),
  }),
};
export const updateWalletName = {
  body: Joi.object().keys({
    address: Joi.string().required().custom(walletAddress),
    name: Joi.string().required(),
  }),
};

export const getUsers = {
  query: Joi.object().keys({
    q: Joi.string(),
    getStats: Joi.boolean(),
    username: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    populate: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

export const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      role: Joi.string().valid('user', 'admin'),
      isSuspended: Joi.boolean(),
    })
    .min(1),
};

export const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};
