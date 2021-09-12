import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';

import User from '../../db/models/user';
import { CustomSessionData, RequestWithSession } from '../models/interfaces/request';

export async function getToken(req: Request) {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  try {
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      const session = (req as RequestWithSession).session;
      session.user = user.toJSON() as any;
      return { user: session.user };
    } else {
      throw new Error('Invalid credentials');
    }
  } catch (e) {
    throw e;
  }
}

export function deleteToken(req: Request, res: Response) {
  return req.session.destroy((err) => {
    if (err) {
      throw err;
    } else {
      console.log('Session token has been destroyed');
      res.status(204).send();
    }
  });
}

export function refreshToken(req: Request, res: Response) {
  const session = (req as RequestWithSession).session;

  if (!session.user) {
    throw new Error('Session token is missing');
  }

  // TODO: implement token refreshing
  return req.session.regenerate((err) => {
    if (err) {
      throw err;
    } else {
      console.log('Session token has been refreshed');
      res.status(200).send();
    }
  });
}

export function verifyToken(req: Request): Partial<CustomSessionData> {
  const user = (req as RequestWithSession).session.user;
  let data: Partial<CustomSessionData>;

  if (user) {
    data = { ...data, user };
  }

  return data;
}
