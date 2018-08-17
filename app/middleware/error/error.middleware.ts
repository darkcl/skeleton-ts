import {
  ErrorRequestHandler,
  Request,
  Response,
  NextFunction
} from "express-serve-static-core";

import {
  ErrorRenderer,
  ErrorDomain,
  ErrorCode,
  ResponseError
} from "./error_object";
import { ServiceLogger } from "../../utils/Logger/service.logger";

export class ErrorMiddleware {
  constructor(private logger: ServiceLogger = ServiceLogger.shared()) {}

  process(): ErrorRequestHandler {
    return <ErrorRequestHandler>(
      err: Error,
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      const errObject: ResponseError = err as ResponseError;
      this.logger.logAPIError(errObject);
      res
        .status(
          errObject.code !== undefined
            ? errObject.code
            : ErrorCode.InternalError
        )
        .send(ErrorRenderer.render(errObject));
    };
  }
}
