import { RequestHandler, Request, Response, NextFunction } from 'express-serve-static-core';

export class CORSMiddleware {
  constructor(private domains: string[] = []) {}

  private setupCORSHeaders(req: Request, res: Response) {
    if (this.domains.length > 0) {
      const origin = req.headers.origin;
      if (typeof origin === 'string') {
        if (this.domains.indexOf(origin) > -1) {
          res.setHeader('Access-Control-Allow-Origin', origin);
        }
      }
    } else {
      res.setHeader('Access-Control-Allow-Origin', '*');
    }
  }

  processOption(): RequestHandler {
    return <RequestHandler>(req: Request, res: Response, next: NextFunction) => {
      this.setupCORSHeaders(req, res);
      res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
      res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, Content-Length, X-Requested-With, udid'
      );
      res.sendStatus(200);
    };
  }

  process(): RequestHandler {
    return <RequestHandler>(req: Request, res: Response, next: NextFunction) => {
      this.setupCORSHeaders(req, res);
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With');
      next();
    };
  }
}
