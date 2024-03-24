import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

import { roleRights } from '../../../config/roles';
import { ForbiddenError, UnauthorizedError } from '../../../utils/AppError';
import { IUserDoc } from '../../user/models';

export type IAuthMiddleware = (
  ...requiredRights: string[]
) => (req: Request, res: Response, next: NextFunction) => Promise<void>;

export const authMiddlewareBuilder = (): IAuthMiddleware => {
  const verifyCallback =
    (req: Request, resolve: any, reject: any, requiredRights: string[]) =>
    async (err: Error, user: IUserDoc, info: string) => {
      if (requiredRights.includes('optional') && !req.headers['authorization']) {
        return resolve();
      }
      if (err || info || !user) {
        return reject(new UnauthorizedError('Please authenticate'));
      }
      req.user = user;
      if (requiredRights.length) {
        const userRights = roleRights.get(user.role);
        if (!userRights) return reject(new ForbiddenError('Forbidden'));
        const hasRequiredRights = requiredRights.every(
          (requiredRight: string) =>
            userRights.includes(requiredRight) || requiredRight === 'optional',
        );
        if (!hasRequiredRights && req.params['userId'] !== user.id) {
          return reject(new ForbiddenError('Forbidden'));
        }
      }

      resolve();
    };

  const authMiddleware =
    (...requiredRights: string[]) =>
    async (req: Request, res: Response, next: NextFunction) =>
      new Promise<void>((resolve, reject) => {
        passport.authenticate(
          'jwt',
          { session: false },
          verifyCallback(req, resolve, reject, requiredRights),
        )(req, res, next);
      })
        .then(() => next())
        .catch(err => next(err));

  return authMiddleware;
};
