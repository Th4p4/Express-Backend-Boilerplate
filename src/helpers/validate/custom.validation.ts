import { CustomHelpers } from 'joi';

export const objectId = (value: string, helpers: CustomHelpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message({ custom: '"{{#label}}" must be a valid mongo id' });
  }
  return value;
};

export const password = (value: string, helpers: CustomHelpers) => {
  if (value.length < 8) {
    return helpers.message({ custom: 'password must be at least 8 characters' });
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message({ custom: 'password must contain at least 1 letter and 1 number' });
  }
  return value;
};

export const username = (value: string, helpers: CustomHelpers) => {
  if (value.length > 20) {
    return helpers.message({ custom: 'username must be only 1-20 characters long' });
  }
  if (!value.match(/^[\da-z_]+$/) || (value.match(/_/g) || []).length > 1) {
    return helpers.message({
      custom: 'username can only contain lowercase alphanumeric characters and an underscore',
    });
  }

  return value;
};

export const walletAddress = (value: string, helpers: CustomHelpers) => {
  if (!value.match(/^0x[a-fA-F0-9]{40}$/gm)) {
    return helpers.message({ custom: '"{{#label}}" must be a bsc address' });
  }
  return value;
};
