import { LocalizedMessage } from "../locale/interface";
import { Request } from "express";

export interface LocalizableRequest extends Request {
  messageStore: LocalizedMessage;
}
