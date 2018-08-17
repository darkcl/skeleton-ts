import {
  controller,
  httpGet,
  BaseHttpController,
  request,
  response,
  httpPost
} from "inversify-express-utils";
import { inject } from "inversify";
import { ISession, SessionService } from "../service/session";
import { Request, Response } from "express";
import TYPES from "../constant/types";
import { DataObject } from "../common";

@controller("/sessions")
export class SessionController extends BaseHttpController {
  constructor(
    @inject(TYPES.SessionService) private sessionService: SessionService
  ) {
    super();
  }

  @httpPost("/")
  public async createSession(
    @request() req: Request,
    @response() res: Response
  ) {
    const result: DataObject<ISession> = new DataObject<ISession>(await this.sessionService.createSession('1', '1', '1', '1'), 200);

    res.status(result._status).send(result.asJson());
  }
}
