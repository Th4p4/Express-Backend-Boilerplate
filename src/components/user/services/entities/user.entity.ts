import { AccessAndRefreshTokens } from '../../../auth/services/entities';

export interface IUser {
  username: string;
  email: string;
  password: string;
  role: string;
  isEmailVerified: boolean;
  lastLoggedinDate: Date;
  isSuspended: boolean;
}

export type UpdateUserBody = Partial<IUser>;

export type NewRegisteredUser = Omit<
  IUser,
  'role' | 'isEmailVerified' | 'lastLoggedinDate' | 'isSuspended'
>;

export type NewCreatedUser = Omit<IUser, 'isEmailVerified' | 'lastLoggedinDate' | 'isSuspended'>;

export interface IUserWithTokens {
  user: IUser;
  tokens: AccessAndRefreshTokens;
}
