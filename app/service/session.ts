import { injectable, inject } from "inversify";

export interface ISession {
  userId: string;
  email: string;
  token: string;
  hashedUserId: string;
  hashedUserEmail: string;
}

@injectable()
export class SessionService {

  public async createSession(
    loginEmail: string,
    loginPassword: string,
    type: string,
    udid?: string
  ): Promise<ISession> {
    throw new Error('Not Implemented')
  }
}
