import express, { Router } from 'express';

import { validate } from '../../helpers/validate';
import * as authValidation from './validations/auth.validation';
import { IAuthController } from './auth.controller';
import { IAuthMiddleware } from './middlewares/auth.middleware';

export const authRouteBuilder = (
  authController: IAuthController,
  middlewares: { authMiddleware: IAuthMiddleware },
) => {
  const router: Router = express.Router();

  /**
   * @swagger
   * /auth/register:
   *   post:
   *     summary: Register as user
   *     tags: [Auth]
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
   *               codeReferral:
   *                 type: string
   *                 description: Referring user's referral code
   *             example:
   *               username: fakename
   *               email: fake@example.com
   *               password: password1
   *               codeReferral: abcd
   *     responses:
   *       "201":
   *         description: Created
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 user:
   *                   $ref: '#/components/schemas/User'
   *                 tokens:
   *                   $ref: '#/components/schemas/AuthTokens'
   *       "400":
   *         $ref: '#/components/responses/DuplicateEmail'
   */
  router.post('/auth/register', validate(authValidation.register), authController.register);

  /**
   * @swagger
   * /auth/login:
   *   post:
   *     summary: Login
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *               password:
   *                 type: string
   *                 format: password
   *             example:
   *               email: fake@example.com
   *               password: password1
   *     responses:
   *       "200":
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 user:
   *                   $ref: '#/components/schemas/User'
   *                 tokens:
   *                   $ref: '#/components/schemas/AuthTokens'
   *       "401":
   *         description: Invalid email or password
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *             example:
   *               code: 401
   *               message: Invalid email or password
   */
  router.post('/auth/login', validate(authValidation.login), authController.login);

  /**
   * @swagger
   * /auth/logout:
   *   post:
   *     summary: Logout
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - refreshToken
   *             properties:
   *               refreshToken:
   *                 type: string
   *             example:
   *               refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZWJhYzUzNDk1NGI1NDEzOTgwNmMxMTIiLCJpYXQiOjE1ODkyOTg0ODQsImV4cCI6MTU4OTMwMDI4NH0.m1U63blB0MLej_WfB7yC2FTMnCziif9X8yzwDEfJXAg
   *     responses:
   *       "204":
   *         description: No content
   *       "404":
   *         $ref: '#/components/responses/NotFound'
   */
  router.post('/auth/logout', validate(authValidation.logout), authController.logout);

  /**
   * @swagger
   * /auth/refresh-tokens:
   *   post:
   *     summary: Refresh auth tokens
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - refreshToken
   *             properties:
   *               refreshToken:
   *                 type: string
   *             example:
   *               refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZWJhYzUzNDk1NGI1NDEzOTgwNmMxMTIiLCJpYXQiOjE1ODkyOTg0ODQsImV4cCI6MTU4OTMwMDI4NH0.m1U63blB0MLej_WfB7yC2FTMnCziif9X8yzwDEfJXAg
   *     responses:
   *       "200":
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UserWithTokens'
   *       "401":
   *         $ref: '#/components/responses/Unauthorized'
   */
  router.post(
    '/auth/refresh-tokens',
    validate(authValidation.refreshTokens),
    authController.refreshTokens,
  );

  /**
   * @swagger
   * /auth/forgot-password:
   *   post:
   *     summary: Forgot password
   *     description: An email will be sent to reset password.
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *             example:
   *               email: fake@example.com
   *     responses:
   *       "204":
   *         description: No content
   *       "404":
   *         $ref: '#/components/responses/NotFound'
   */
  router.post(
    '/auth/forgot-password',
    validate(authValidation.forgotPassword),
    authController.forgotPassword,
  );

  /**
   * @swagger
   * /auth/reset-password:
   *   post:
   *     summary: Reset password
   *     tags: [Auth]
   *     parameters:
   *       - in: query
   *         name: token
   *         required: true
   *         schema:
   *           type: string
   *         description: The reset password token
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - password
   *             properties:
   *               password:
   *                 type: string
   *                 format: password
   *                 minLength: 8
   *                 description: At least one number and one letter
   *             example:
   *               password: password1
   *     responses:
   *       "204":
   *         description: No content
   *       "401":
   *         description: Password reset failed
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *             example:
   *               code: 401
   *               message: Password reset failed
   */
  router.post(
    '/auth/reset-password',
    validate(authValidation.resetPassword),
    authController.resetPassword,
  );

  /**
   * @swagger
   * /auth/change-password:
   *   post:
   *     summary: Change password
   *     tags: [Auth]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - oldPassword
   *               - newPassword
   *             properties:
   *               oldPassword:
   *                 type: string
   *                 format: password
   *               newPassword:
   *                 type: string
   *                 format: password
   *                 minLength: 8
   *                 description: At least one number and one letter
   *             example:
   *               oldPassword: password1
   *               newPassword: password2
   *     responses:
   *       "204":
   *         description: No content
   *       "401":
   *         description: Password change failed
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *             example:
   *               code: 401
   *               message: Password change failed
   */
  router.post(
    '/auth/change-password',
    middlewares.authMiddleware(),
    validate(authValidation.changePassword),
    authController.changePassword,
  );

  /**
   * @swagger
   * /auth/send-verification-email:
   *   post:
   *     summary: Send verification email
   *     description: An email will be sent to verify email.
   *     tags: [Auth]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       "204":
   *         description: No content
   *       "401":
   *         $ref: '#/components/responses/Unauthorized'
   */
  router.post(
    '/auth/send-verification-email',
    middlewares.authMiddleware(),
    authController.sendVerificationEmail,
  );

  /**
   * @swagger
   * /auth/verify-email:
   *   post:
   *     summary: verify email
   *     tags: [Auth]
   *     parameters:
   *       - in: query
   *         name: token
   *         required: true
   *         schema:
   *           type: string
   *         description: The verify email token
   *     responses:
   *       "204":
   *         description: No content
   *       "401":
   *         description: verify email failed
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *             example:
   *               code: 401
   *               message: verify email failed
   */

  return router;
};
