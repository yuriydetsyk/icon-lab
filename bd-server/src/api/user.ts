import { Request } from 'express';

import { UserModel } from '../../db/models/user';
import { RequestWithUser } from '../models/interfaces/request';
import { UserData } from '../models/interfaces/user-data';

export function getUser(userId: string) {
  return UserModel.findByPk(userId);
}

export function setSessionUser(req: Request, user: UserData) {
  (req as RequestWithUser).user = user;
}
