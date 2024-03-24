import httpStatusCode from 'http-status';

class AppError extends Error {
  data;
  statusCode;
  override message;
  isOperational;
  constructor(statusCode: number, message: string, data: any, isOperational: boolean) {
    super();
    this.data = data;
    this.message = message;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    // Error.captureStackTrace(this);
  }
}

class BadRequestError extends AppError {
  constructor(message = 'Bad Request', data = {}, isOperational = true) {
    super(httpStatusCode.BAD_REQUEST, message, data, isOperational);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized', data = {}, isOperational = true) {
    super(httpStatusCode.UNAUTHORIZED, message, data, isOperational);
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'Forbidden', data = {}, isOperational = true) {
    super(httpStatusCode.FORBIDDEN, message, data, isOperational);
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Not Found', data = {}, isOperational = true) {
    super(httpStatusCode.NOT_FOUND, message, data, isOperational);
  }
}

class InternalServerError extends AppError {
  constructor(message = 'Internal Server Error', data = {}, isOperational = true) {
    super(httpStatusCode.INTERNAL_SERVER_ERROR, message, data, isOperational);
  }
}

export {
  AppError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  InternalServerError,
};
