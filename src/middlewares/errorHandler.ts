import express, { Request, Response, NextFunction } from 'express';

import httpStatus from 'http-status';
// import { MulterError } from 'multer';
// import { ZodError } from 'zod';
import httpStatusCode from 'http-status';
import mongoose from 'mongoose';

import { logger } from '../logger';
import { AppError } from '../utils/AppError';

const errorConverter = (err: any, _req: Request, _res: Response, next: NextFunction) => {
  let error = err;
  if (!(error instanceof AppError)) {
    const statusCode =
      error.statusCode || error instanceof mongoose.Error
        ? httpStatus.BAD_REQUEST
        : httpStatus.INTERNAL_SERVER_ERROR;
    const message: string = error.message || `${httpStatus[statusCode]}`;
    error = new AppError(statusCode, message, err.stack, false);
  }
  next(error);
};

const errorHandler = (
  err: any,
  req?: express.Request,
  res?: express.Response,
  _next?: NextFunction,
) => {
  if (!isTrustedError(err)) {
    logger.error(err, { path: req?.path });
    return res?.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      code: httpStatusCode.INTERNAL_SERVER_ERROR,
      message: 'Something went wrong',
    });
  }

  // if (isZodError(err)) {
  //   // req?.logger.warn('Invalid input provided', { validationError: err });
  //   err = new BadRequestError('Bad Request', (err as ZodError).format());
  // }
  // if (isMulterError(err)) {
  //   let errMsg = err.message;
  //   if (err.code == 'LIMIT_FILE_SIZE') {
  //     errMsg = 'Image should be less than 200KB';
  //   }
  //   req?.logger.warn('Invalid file upload', { validationError: err });
  //   err = new BadRequestError(err.message, { _errors: errMsg });
  // }
  const { statusCode, message, data } = err;

  return res?.status(statusCode).json({ success: false, code: statusCode, message, data });
};

const isTrustedError = (error: any) => {
  if (error instanceof AppError) {
    return error.isOperational;
  }
  // return isZodError(error) || isMulterError(error);
  // return isMulterError(error);
  return false;
};

// const isZodError = (error: any) => {
//   if (error instanceof ZodError) {
//     return true;
//   }
//   return false;
// };

// const isMulterError = (error: any) => {
//   if (error instanceof MulterError) {
//     return true;
//   }
//   return false;
// };

export { errorConverter, errorHandler, isTrustedError };
