import { Request } from 'express';

import User from '../../db/models/user';
import { RequestWithUser } from '../models/interfaces/request';
import { UserData } from '../models/interfaces/user-data';

export function getUser(userId: string) {
  return User.findByPk(userId);
}

export function setSessionUser(req: Request, user: UserData) {
  (req as RequestWithUser).user = user;
}
