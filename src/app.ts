import compression from 'compression';
import cors from 'cors';
import express, { Express } from 'express';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import xss from 'xss-clean';
import path from 'path';

import config from './config/config';
import buildDependency from './di';
import expressInit from './express/express';
import { morgan } from './logger';
import requestLogger from './middlewares/logger';
import passport, { Strategy } from 'passport';

const loadExpressMiddlewares = (
  app: Express,
  authStrategies: {
    [x: string]: Strategy;
  },
) => {
  if (config.env !== 'test') {
    app.use(morgan.successHandler);
    app.use(morgan.errorLogHandler);
  }

  // set security HTTP headers
  app.use(helmet());

  // enable cors
  app.use(
    cors({
      origin: [
        'https://localhost:5173',
        'https://127.0.0.1:5173',
        'https://localhost:5174',
        'http://127.0.0.1:5174/',
        'https://192.168.1.75:5173/',
      ],
      credentials: true,
    }),
  );


  app.use('/images', express.static(path.resolve('./images')));

  // parse json request body
  app.use(express.json());

  // parse urlencoded request body
  app.use(express.urlencoded({ extended: true }));

  // sanitize request data
  app.use(xss());
  app.use(ExpressMongoSanitize());

  // gzip compression
  app.use(compression());
  app.use(requestLogger);

  // jwt authentication
  app.use(passport.initialize());
  Object.entries(authStrategies).forEach(value => {
    passport.use(value[0], value[1]);
  });
};

const buildApp = async () => {
  const app: Express = express();

  const { routes, authStrategies } = buildDependency();

  //load all package express middlewares
  loadExpressMiddlewares(app, authStrategies);

  //NOTE: middlewares yet to be handled properly

  expressInit(app, routes);

  return app;
};

export { buildApp };
