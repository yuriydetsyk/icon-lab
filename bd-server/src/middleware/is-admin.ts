import { NextFunction, Request, Response } from 'express';

import { RequestWithUser } from '../models/interfaces/request';

export async function isAdmin(req: Request, res: Response, next: NextFunction) {
  const user = (req as RequestWithUser).user;

  if (!user?.isAdmin) {
    return res.sendStatus(403);
  }

  return next();
}
