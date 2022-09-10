import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { setSessionUser } from '../api/user';
import { config } from '../config';

import { RequestWithUser, SessionData } from '../models/interfaces/request';

export async function isAuthorized(req: Request, res: Response, next: NextFunction) {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    return res.sendStatus(403);
  }

  const token = authorizationHeader.split('Bearer')[1].trim();
  if (!token) {
    return res.sendStatus(403);
  }

  jwt.verify(token, config.server.sessionSecret);
  const { user: payloadUser } = jwt.decode(token) as SessionData;

  const user = (req as RequestWithUser).user;
  if (user && payloadUser.id !== user.id) {
    return res.sendStatus(403);
  }

  if (!user) {
    setSessionUser(req, payloadUser);
  }

  return next();
}
