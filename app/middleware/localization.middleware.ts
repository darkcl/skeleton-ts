import { RequestHandler, Request, Response, NextFunction } from 'express';
import { Localization } from '../locale';
import { LocalizedMessage } from '../locale/interface';
import { LocalizableRequest } from '../common/localizable.request.interface';
import { BaseMiddleware } from 'inversify-express-utils';
import { injectable } from 'inversify';

@injectable()
export class LocalizationMiddleware extends BaseMiddleware {
  handler(req: Request, res: Response, next: NextFunction): void {
    const locale: Localization = Localization.shared(this.defaultLocale);
    const messageStore: LocalizedMessage = locale.of(req.acceptsLanguages());
    (req as LocalizableRequest).messageStore = messageStore;
    next();
  }
  constructor(private defaultLocale: string) {
    super();
  }
}
