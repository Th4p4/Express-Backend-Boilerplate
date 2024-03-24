import { IAppRoutes } from './../index.type';
import { Express } from 'express';
import { loadRoutes } from './routes';

import { errorHandler, errorConverter } from '../helpers/errors';

function expressInit(app: Express, appRoutes: IAppRoutes) {
  // Load API routes
  loadRoutes(app, appRoutes);

  // handle error
  app.use(errorConverter);
  app.use(errorHandler);
}
export default expressInit;
