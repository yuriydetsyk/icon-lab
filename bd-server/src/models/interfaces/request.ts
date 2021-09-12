import { Request } from 'express';
import session from 'express-session';

import User from '../../../db/models/user';
import { UserData } from './user-data';

export interface CustomSessionData {
  user: User;
}
export interface RequestWithUser extends Request {
  user: UserData;
}
export interface RequestWithSession extends Request {
  session: session.Session & Partial<session.SessionData> & CustomSessionData;
}

export function isRequestWithUser(req: Request): req is RequestWithUser {
  return !!(req as RequestWithUser).user;
}
