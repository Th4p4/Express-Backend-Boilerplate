import httpStatus from 'http-status';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

import catchAsync from '../../helpers/utils/catchAsync';
import { IUserService } from './services/user.service';
import { ControllerSignature } from '../common/controller';
import pick from '../../helpers/utils/pick';
import { IOptions } from '../../helpers/paginate/paginate';
import { NotFoundError } from '../../utils/AppError';
import { IAuthService } from '../auth/services/auth.service';
import FormatResponse from '../../utils/Response';

export interface IUserController {
  createUser: ControllerSignature;
  getUsers: ControllerSignature;
  getUser: ControllerSignature;
  updateUser: ControllerSignature;
  deleteUser: ControllerSignature;
}

export const userControllerBuilder = (
  userService: IUserService,
  authService: IAuthService,
): IUserController => {
  const createUser = catchAsync(async (req: Request, res: Response) => {
    const user = await userService(req.logger).createUser(req.body);
    res.status(httpStatus.CREATED).send(user);
  });
  authService;

  const getUsers = catchAsync(async (req: Request, res: Response) => {
    const { q } = pick(req.query, ['q']);
    const filter = pick(req.query, ['name', 'role', 'email']);
    const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy', 'populate']);
    const result = await userService(req.logger).queryUsers(q, filter, options);
    const response = FormatResponse(true, 'Users Fetched Successfully', result);
    res.send(response);
  });

  const getUser = catchAsync(async (req: Request, res: Response) => {
    if (typeof req.params['userId'] === 'string') {
      const user = await userService(req.logger).getUserById(
        new mongoose.Types.ObjectId(req.params['userId']),
      );
      if (!user) {
        throw new NotFoundError('User not found');
      }
      const response = FormatResponse(true, 'User Fetched Successfully', user);

      res.send(response);
    }
  });

  const updateUser = catchAsync(async (req: Request, res: Response) => {
    if (typeof req.params['userId'] === 'string') {
      const user = await userService(req.logger).updateUserById(
        new mongoose.Types.ObjectId(req.params['userId']),
        req.body,
      );
      res.send(user);
    }
  });

  const deleteUser = catchAsync(async (req: Request, res: Response) => {
    if (typeof req.params['userId'] === 'string') {
      await userService(req.logger).deleteUserById(
        new mongoose.Types.ObjectId(req.params['userId']),
      );
      res.status(httpStatus.NO_CONTENT).send();
    }
  });

  return {
    createUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser,
  };
};
