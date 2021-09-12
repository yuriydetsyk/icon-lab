import { NextFunction, Request, Response } from 'express';

import User from '../../db/models/user';
import { RequestWithSession } from '../models/interfaces/request';

export async function isAdmin(req: Request, res: Response, next: NextFunction) {
  const user: User = (req as RequestWithSession).session.user;

  if (!user?.isAdmin) {
    return res.sendStatus(403);
  }

  return next();
}
