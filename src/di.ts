import { Router } from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import multer from 'multer';
import path from 'path';

import swaggerDefinition from './components/swagger/swagger.definition';
import swaggerRouterBuilder from './components/swagger/swaggerAPI';
import config from './config/config';
import { IAppDependency } from './index.type';
import { tokenModelBuilder } from './components/auth/models';
import { userServiceBuilder } from './components/user/services/user.service';
import { authServiceBuilder } from './components/auth/services/auth.service';
import { authMiddlewareBuilder } from './components/auth/middlewares/auth.middleware';
import { userModelBuilder } from './components/user/models';
import { userControllerBuilder } from './components/user/user.controller';
import { userRouteBuilder } from './components/user/userAPI';
import { jwtStrategyBuilder } from './components/auth/middlewares/jwt.strategy';
import { BadRequestError } from './utils/AppError';
import { authRouteBuilder } from './components/auth/authAPI';
import { authControllerBuilder } from './components/auth/auth.controller';
import { tokenServiceBuilder } from './components/auth/services/token.service';
import UserRepository from './components/user/repository/userRepository';
import TokenRepository from './components/auth/repository/tokenRepository';

const buildDependency = (): IAppDependency => {
  // models
  const userModel = userModelBuilder();
  const tokenModel = tokenModelBuilder();

  // middlewares
  const authMiddleware = authMiddlewareBuilder();
  const jwtStrategy = jwtStrategyBuilder(userModel);

  // repositories
  const userRepository = new UserRepository(userModel);
  const tokenRepository = new TokenRepository(tokenModel);

  //services
  const userService = userServiceBuilder(userRepository);
  const tokenService = tokenServiceBuilder(tokenRepository, userRepository);
  const authService = authServiceBuilder(tokenRepository, userService, tokenService);

  // controllers
  const userController = userControllerBuilder(userService, authService);
  const authController = authControllerBuilder(tokenService, userService, authService);

  // multer
  const upload = multer({
    fileFilter: function (_, file, callback) {
      const ext = path.extname(file.originalname);
      if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
        return callback(new BadRequestError('Only images are allowed'));
      }
      callback(null, true);
    },
  });
  // routes
  const userRoute = userRouteBuilder(userController, {
    authMiddleware,
    fileUpload: (fieldName: string) => upload.single(fieldName),
  });
  const authRoute = authRouteBuilder(authController, { authMiddleware });

  let swaggerRoute: Router | undefined = undefined;

  if (config.env == 'development') {
    const swaggerSpecs = swaggerJSDoc({
      swaggerDefinition,
      apis: [
        'packages/components.yaml',
        'dist/components/auth/authAPI.js',
        'dist/components/user/userAPI.js',
      ],
    });

    swaggerRoute = swaggerRouterBuilder(
      swaggerUi.serve,
      swaggerUi.setup(swaggerSpecs, { explorer: true }),
    );
  }

  const appRoutes = {
    authRoute,
    userRoute,
  };
  const routes = swaggerRoute
    ? {
        ...appRoutes,
        swaggerRoute,
      }
    : appRoutes;

  return {
    routes,
    middlewares: {},
    authStrategies: { jwt: jwtStrategy },
  };
};

export default buildDependency;
