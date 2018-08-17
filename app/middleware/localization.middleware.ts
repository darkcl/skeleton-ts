import { RequestHandler, Request, Response, NextFunction } from "express";
import { Localization } from "../locale";
import { LocalizedMessage } from "../locale/interface";
import { LocalizableRequest } from "../common/localizable.request.interface";

export class LocalizationMiddleware {
  constructor(private defaultLocale: string) {}

  process(): RequestHandler {
    return async <RequestHandler>(
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      const locale: Localization = Localization.shared(this.defaultLocale);
      const messageStore: LocalizedMessage = locale.of(req.acceptsLanguages());
      (req as LocalizableRequest).messageStore = messageStore;
      next();
    };
  }
}
