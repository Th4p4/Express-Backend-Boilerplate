import { Router, Express } from 'express';
import { IAppRoutes } from 'src/index.type';

const loadRoutes = (app: Express, routes: IAppRoutes) => {
  const appRoutes = Object.values<Router>(routes);
  app.use('/api', appRoutes);

  // not found
  app.all('*', (req, res) => {
    res.status(404).json({
      status: 'error',
      path: req.originalUrl,
      message: `The app you are using is not latest, for this service you need to update your application.`,
      systemTime: Date.now(),
    });
  });
};
export { loadRoutes };
