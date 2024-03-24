import httpStatus from 'http-status';
import { Request, Response } from 'express';
import catchAsync from '../../helpers/utils/catchAsync';
import { emailService } from '../../helpers/email';
import { ITokenService } from './services/token.service';
import { IUserService } from '../user/services/user.service';
import { IAuthService } from './services/auth.service';
import FormatResponse from '../../utils/Response';
import { ControllerSignature } from '../common/controller';

export interface IAuthController {
  register: ControllerSignature;
  login: ControllerSignature;
  logout: ControllerSignature;
  refreshTokens: ControllerSignature;
  forgotPassword: ControllerSignature;
  resetPassword: ControllerSignature;
  changePassword: ControllerSignature;
  sendVerificationEmail: ControllerSignature;
  verifyEmail: ControllerSignature;
}

export const authControllerBuilder = (
  tokenService: ITokenService,
  userService: IUserService,
  authService: IAuthService,
): IAuthController => {
  const register = catchAsync(async (req: Request, res: Response) => {
    const user = await userService(req.logger).registerUser(req.body);
    const tokens = await tokenService(req.logger).generateAuthTokens(user._id);
    const verifyEmailToken = await tokenService(req.logger).generateVerifyEmailToken(user._id);
    emailService.sendVerificationEmail(user.email, verifyEmailToken, user.username);

    const response = FormatResponse(true, 'User Created successfully.', { user, tokens });
    res.send(response);
  });

  const login = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await authService(req.logger).loginUserWithEmailAndPassword(email, password);
    const tokens = await tokenService(req.logger).generateAuthTokens(user._id);
    const response = FormatResponse(true, 'User logged in successfully.', { user, tokens });
    res.send(response);
  });

  const logout = catchAsync(async (req: Request, res: Response) => {
    await authService(req.logger).logout(req.body.refreshToken);
    res.status(httpStatus.NO_CONTENT).send();
  });

  const refreshTokens = catchAsync(async (req: Request, res: Response) => {
    const userWithTokens = await authService(req.logger).refreshAuth(req.body.refreshToken);
    const response = FormatResponse(true, 'Tokens refreshed successfully.', userWithTokens);
    res.send(response);
  });

  const forgotPassword = catchAsync(async (req: Request, res: Response) => {
    const resetPasswordToken = await tokenService(req.logger).generateResetPasswordToken(
      req.body.email,
    );
    await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
    res.status(httpStatus.NO_CONTENT).send();
  });

  const resetPassword = catchAsync(async (req: Request, res: Response) => {
    await authService(req.logger).resetPassword(req.query.token, req.body.password);
    res.status(httpStatus.NO_CONTENT).send();
  });

  const changePassword = catchAsync(async (req: Request, res: Response) => {
    await authService(req.logger).changePassword(
      req.user.id,
      req.body.oldPassword,
      req.body.newPassword,
    );
    res.status(httpStatus.NO_CONTENT).send();
  });

  const sendVerificationEmail = catchAsync(async (req: Request, res: Response) => {
    const verifyEmailToken = await tokenService(req.logger).generateVerifyEmailToken(req.user._id);
    await emailService.sendVerificationEmail(req.user.email, verifyEmailToken, req.user.username);
    res.status(httpStatus.NO_CONTENT).send();
  });

  const verifyEmail = catchAsync(async (req: Request, res: Response) => {
    await authService(req.logger).verifyEmail(req.query.token);
    res.status(httpStatus.NO_CONTENT).send();
  });

  return {
    register,
    login,
    logout,
    refreshTokens,
    forgotPassword,
    resetPassword,
    changePassword,
    sendVerificationEmail,
    verifyEmail,
  };
};
