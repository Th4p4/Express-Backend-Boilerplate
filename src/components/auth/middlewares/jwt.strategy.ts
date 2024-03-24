import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import config from '../../../config/config';
import { IPayload } from '../services/entities';
import { tokenTypes } from '../models';
import { IUserModel } from '../../user/models';

export const jwtStrategyBuilder = (userModel: IUserModel) => {
  const jwtStrategy = new JwtStrategy(
    {
      secretOrKey: config.jwt.secret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (payload: IPayload, done) => {
      try {
        if (payload.type !== tokenTypes.ACCESS) {
          throw new Error('Invalid token type');
        }
        const user = await userModel.findById(payload.sub);
        if (!user) {
          return done(null, false);
        }
        if (user.isSuspended) {
          return done(null, false);
        }
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    },
  );

  return jwtStrategy;
};
