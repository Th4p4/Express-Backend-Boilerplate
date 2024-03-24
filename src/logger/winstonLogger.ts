import config from './../config/config';
import { createLogger, transports, format } from 'winston';

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.metadata(),
    format.timestamp(),
    format.errors({ stack: true }),
    format.json(),
  ),
  defaultMeta: { service: 'app-backend' },
  transports: [new transports.File({ filename: 'logs/application.log' })],
});

if (config.env == 'development') {
  const consoleFormat = format.printf(({ level, message, timestamp, stack, metadata }) => {
    return `${timestamp} ${metadata.requestId} [${metadata.method ?? ''} ${metadata.path ?? ''} ${
      metadata.statusCode ?? ''
    }] ${level}: ${stack ?? message}`;
  });
  logger.add(
    new transports.Console({
      level: 'debug',
      format: format.combine(format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), consoleFormat),
    }),
  );
}

const getLogger = (requestId: string, hostname: string) => {
  return logger.child({ requestId, hostname });
};

export { logger, getLogger };
