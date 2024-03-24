import { Router } from 'express';
import { Strategy } from 'passport-jwt';

type Prettify<T> = {
  [K in keyof T]: T[K];
} & unknown;

interface IRoutes {
  [x: string]: Router;
}

interface IAppRoutes extends IRoutes {
  authRoute: Router;
  userRoute: Router;
  swaggerRoute?: Router;
}

interface IMiddlewares {
  [x: string]: any;
}

interface IAppDependency {
  routes: IAppRoutes;
  middlewares: IMiddlewares;
  authStrategies: { [x: string]: Strategy };
}
export { IAppDependency, Prettify, IAppRoutes, IMiddlewares };
