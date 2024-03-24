// import 'module-alias/register'
import { Express } from 'express';
import { IncomingMessage, Server, ServerResponse } from 'http';
import mongoose from 'mongoose';

import { buildApp } from './app';
import config from './config/config';

import logger from './helpers/logger/logger';
import https from 'https';
import http from 'http';
import fs from 'fs';
const handleUnexpectedErrors = (server: Server<typeof IncomingMessage, typeof ServerResponse>) => {
  const exitHandler = () => {
    if (server) {
      server.close(() => {
        logger.info('Server closed');
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  };

  const unexpectedErrorHandler = (error: string) => {
    logger.error(error);
    exitHandler();
  };

  process.on('unhandledRejection', (error: any) => {
    console.log('unhalded rejections :: ', error);
    throw error;
  });

  process.on('uncaughtException', unexpectedErrorHandler);

  process.on('SIGTERM', () => {
    logger.info('SIGTERM received');
    if (server) {
      server.close();
    }
  });
};

const connectToDataBase = async () => {
  await mongoose.connect(config.mongoose.url);
  return console.log('connected to database');
};

const startListening = (app: Express) => {
  let httpsServer, httpServer;
  try {
    let key = fs.readFileSync('lotto.key', 'utf-8');
    let cert = fs.readFileSync('lotto.crt', 'utf-8');
    const creds = { key, cert };
    httpsServer = https.createServer(creds, app).listen(config.port, () => {
      console.log(`https server running at port ${config.port}`);
    });
    httpServer = http.createServer(app).listen(config.port + 1, () => {
      console.log(`http server running at port ${config.port + 1}`);
    });
  } catch (error) {
    httpServer = http.createServer(app).listen(config.port, () => {
      console.log(`http server running at port ${config.port}`);
    });
  }

  return { httpsServer, httpServer };
};

async function startServer(app: Promise<Express>) {
  await connectToDataBase();

  const { httpsServer, httpServer } = startListening(await app);

  //listen to unexpected error
  if (httpsServer) handleUnexpectedErrors(httpsServer);
  handleUnexpectedErrors(httpServer);
}
const app = buildApp();
startServer(app);
