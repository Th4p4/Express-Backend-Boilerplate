import express, { RequestHandler } from 'express';
const swaggerRouterBuilder = (controller: RequestHandler[], specsSetup: RequestHandler) => {
  const RouteClass = express.Router();

  RouteClass.use('/docs', controller, specsSetup);

  return RouteClass;
};

export default swaggerRouterBuilder;
