import { IUserDoc } from '../components/user/models';
declare module 'express-serve-static-core' {
  export interface Request {
    user: IUserDoc;
  }
}

declare module 'express-session' {
  export interface SessionData {
    nonce: string;
    siwe: string;
  }
}
