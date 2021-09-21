import { Request } from 'express';

import { UserData } from './user-data';

export interface SessionData {
  user: UserData;
}
export interface RequestWithUser extends Request {
  user: UserData;
}

export function isRequestWithUser(req: Request): req is RequestWithUser {
  return !!(req as RequestWithUser).user;
}
