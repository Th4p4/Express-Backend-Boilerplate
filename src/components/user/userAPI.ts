import express, { RequestHandler, Router } from 'express';

import { validate } from '../../helpers/validate';
import * as userValidation from './validations/user.validation';
import { IUserController } from './user.controller';
import { IAuthMiddleware } from '../auth/middlewares/auth.middleware';

export const userRouteBuilder = (
  userController: IUserController,
  middlewares: {
    authMiddleware: IAuthMiddleware;
    fileUpload: (fieldName: string) => RequestHandler;
  },
) => {
  const router: Router = express.Router();

  /**
   * @swagger
   * /users:
   *   post:
  *     summary: Create a user
   *     description: Only admins can create other users.
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - username
   *               - email
   *               - password
   *               - role
   *             properties:
   *               username:
   *                 type: string
   *                 description: must be unique
   *               email:
   *                 type: string
   *                 format: email
   *                 description: must be unique
   *               password:
   *                 type: string
   *                 format: password
   *                 minLength: 8
   *                 description: At least one number and one letter
   *               role:
   *                  type: string
   *                  enum: [user, admin]
   *             example:
   *               username: fakeuser
   *               email: fake@example.com
   *               password: password1
   *               role: user
   *     responses:
   *       "201":
   *         description: Created
   *         content:
   *           application/json:
   *             schema:
   *                $ref: '#/components/schemas/User'
   *       "400":
   *         $ref: '#/components/responses/DuplicateEmail'
   *       "401":
   *         $ref: '#/components/responses/Unauthorized'
   *       "403":
   *         $ref: '#/components/responses/Forbidden'
   *
   *   get:
   *     summary: Get all users
   *     description: Only admins can retrieve all users.
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: q
   *         schema:
   *           type: string
   *         description: search query
   *       - in: query
   *         name: getStats
   *         schema:
   *           type: boolean
   *         description: get users along with stats
   *       - in: query
   *         name: username
   *         schema:
   *           type: string
   *         description: User name
   *       - in: query
   *         name: role
   *         schema:
   *           type: string
   *         description: User role
   *       - in: query
   *         name: populate
   *         schema:
   *           type: string
   *         description: populate object id (ex. userId)
   *       - in: query
   *         name: sortBy
   *         schema:
   *           type: string
   *         description: sort by query in the form of field:desc/asc (ex. name:asc)
   *       - in: query
   *         name: projectBy
   *         schema:
   *           type: string
   *         description: project by query in the form of field:hide/include (ex. name:hide)
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *         default: 10
   *         description: Maximum number of users
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *           default: 1
   *         description: Page number
   *     responses:
   *       "200":
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 results:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/User'
   *                 page:
   *                   type: integer
   *                   example: 1
   *                 limit:
   *                   type: integer
   *                   example: 10
   *                 totalPages:
   *                   type: integer
   *                   example: 1
   *                 totalResults:
   *                   type: integer
   *                   example: 1
   *       "401":
   *         $ref: '#/components/responses/Unauthorized'
   *       "403":
   *         $ref: '#/components/responses/Forbidden'
   */
  router
    .route('/users')
    .post(
      middlewares.authMiddleware('manageUsers'),
      validate(userValidation.createUser),
      userController.createUser,
    )
    .get(
      middlewares.authMiddleware('getUsers'),
      validate(userValidation.getUsers),
      userController.getUsers,
    );

  /**
   * @swagger
   * /users/{id}:
   *   get:
   *     summary: Get a user
   *     description: Logged in users can fetch only their own user information. Only admins can fetch other users.
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: User id
   *     responses:
   *       "200":
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *                $ref: '#/components/schemas/User'
   *       "401":
   *         $ref: '#/components/responses/Unauthorized'
   *       "403":
   *         $ref: '#/components/responses/Forbidden'
   *       "404":
   *         $ref: '#/components/responses/NotFound'
   *
   *   patch:
   *     summary: Update a user
   *     description: Logged in users can only update their own information. Only admins can update other users.
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: User id
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 description: must be unique
   *               role:
   *                 type: string
   *                 description: only admin can update this field
   *               isSupspended:
   *                 type: boolean
   *                 description: suspend user status to allow them in participation
   *             example:
   *               email: fake@example.com
   *               role: admin
   *               isSupspended: false
   *     responses:
   *       "200":
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *                $ref: '#/components/schemas/User'
   *       "400":
   *         $ref: '#/components/responses/DuplicateEmail'
   *       "401":
   *         $ref: '#/components/responses/Unauthorized'
   *       "403":
   *         $ref: '#/components/responses/Forbidden'
   *       "404":
   *         $ref: '#/components/responses/NotFound'
   *
   *   delete:
   *     summary: Delete a user
   *     description: Logged in users can delete only themselves. Only admins can delete other users.
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: User id
   *     responses:
   *       "200":
   *         description: No content
   *       "401":
   *         $ref: '#/components/responses/Unauthorized'
   *       "403":
   *         $ref: '#/components/responses/Forbidden'
   *       "404":
   *         $ref: '#/components/responses/NotFound'
   */
  router
    .route('/users/:userId')
    .get(
      middlewares.authMiddleware('getUsers'),
      validate(userValidation.getUser),
      userController.getUser,
    )
    .patch(
      middlewares.authMiddleware('manageUsers'),
      validate(userValidation.updateUser),
      userController.updateUser,
    )
    .delete(
      middlewares.authMiddleware('manageUsers'),
      validate(userValidation.deleteUser),
      userController.deleteUser,
    );

  return router;
};
