import { ServiceLogger } from '../../utils/Logger/service.logger';
import { RequestHandler } from 'express';

export class LoggerMiddleware {
  constructor(private logger: ServiceLogger = ServiceLogger.shared()) {}

  process(): RequestHandler {
    return (req, res, next) => {
      if (req.url === '/health' || req.url === '/health/') {
        return next();
      }
      req['_startTime'] = new Date();

      res.on('finish', () => {
        this.logger.logAPIRequest(req, res);
        this.logger.logAPIDuration(req);
        this.logger.logAPIStatusCount(req, res);
      });

      return next();
    };
  }
}
