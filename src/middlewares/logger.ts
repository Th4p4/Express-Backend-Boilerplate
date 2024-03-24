import express from 'express';
import { getLogger } from './../logger';
import onFinished from 'on-finished';

import { ulid } from 'ulid';

const requestLogger = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const requestId = ulid();
  const hostname = req.hostname;
  try {
    req.logger = getLogger(requestId, hostname);
    req.logger.info('Request started', { method: req.method, path: req.path });
    next();
  } catch (e) {
    next(e);
  } finally {
    onFinished(res, () => {
      req.logger.info('Request ended', { statusCode: res.statusCode });
    });
  }
};
export default requestLogger;
