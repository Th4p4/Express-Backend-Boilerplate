import { Logger } from '../logger';

declare global {
  namespace Express {
    export interface Request {
      logger: Logger;
    }
  }
}
