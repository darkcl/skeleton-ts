import 'reflect-metadata';
import { InversifyExpressServer } from 'inversify-express-utils';
import { Container } from 'inversify';
import * as bodyParser from 'body-parser';
import TYPES from './constant/types';

import { ServiceLogger } from './utils/Logger/service.logger';
import { TodoService } from './service/todo';

import { LoggerMiddleware } from './middleware/logger/logger.middleware';
import { CORSMiddleware } from './middleware/cors.middleware';
import { ErrorMiddleware } from './middleware/error/error.middleware';
import { LocalizationMiddleware } from './middleware/localization.middleware';
import helmet from 'helmet';

import './controller/todo';
import { MongoDBConnection } from './utils/mongodb/MongoConnection';
import { TodoRepository } from './repositories/todo.repository';
import { LocalizedMessage } from './locale/interface';
import { Localization } from './locale';
import { AppContainer } from './common/container';

(async () => {
  // Connect to MongoDB
  await MongoDBConnection.connect();

  // load everything needed to the Container
  const appContainer = new AppContainer();

  // start the server
  const server = new InversifyExpressServer(appContainer.load(), null, {
    rootPath: '/api/v1'
  });

  server.setConfig(app => {
    app.use(
      bodyParser.urlencoded({
        extended: true
      })
    );
    app.use(bodyParser.json());

    // CORS
    const whitelist: string[] = process.env.CORS !== undefined ? process.env.CORS.split(',') : [];
    const cors: CORSMiddleware = new CORSMiddleware(whitelist);
    app.use(cors.process());
    app.options('/*', cors.processOption());

    // Logger
    const loggingMiddleware: LoggerMiddleware = new LoggerMiddleware();
    app.use(loggingMiddleware.process());

    // Helmet
    app.use(helmet());
  });

  server.setErrorConfig(app => {
    // Error Logger
    const errorMiddleware: ErrorMiddleware = new ErrorMiddleware();
    app.use(errorMiddleware.process());
  });

  const serverInstance = server.build();

  const port: string = process.env.PORT || '3000';

  serverInstance.listen(parseInt(port));

  ServiceLogger.shared().logMessage(`Server started on port ${port}`);
})();
