import bcrypt from 'bcrypt';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

import { UserModel } from '../../db/models/user';
import { config } from '../config';
import { addDays } from '../helpers/date.helper';
import { Session } from '../models/interfaces/session';
import { UserData } from '../models/interfaces/user-data';
import { addSession, deleteSession, getSession, updateSession } from './session';
import { setSessionUser } from './user';

export async function getToken(req: Request) {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ where: { email } });
  try {
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      const {
        createdAt,
        updatedAt,
        ...userData
      } = user.toJSON() as UserModel;
      const userJson = userData as UserData;

      const token = jwt.sign({ user: userJson }, config.server.sessionSecret);
      await addSession(getSignature(token), userJson);

      setSessionUser(req, userJson);
      return token;
    } else {
      throw new Error('Invalid credentials');
    }
  } catch (e) {
    throw e;
  }
}

export function deleteToken(token: string) {
  return deleteSession(getSignature(token));
}

export async function refreshToken(token: string): Promise<Session> {
  if (!token) {
    throw new Error('Session token is missing');
  }

  jwt.verify(token, config.server.sessionSecret);

  const session = (await getSession(getSignature(token))).toJSON() as Session;
  const updatedSession = { ...session, expires: addDays(session.expires, 7) };
  await updateSession(updatedSession);
  return getSession(getSignature(token));
}

export async function verifyToken(token: string) {
  jwt.verify(token, config.server.sessionSecret);

  const dbRecord = await getSession(getSignature(token));
  if (!dbRecord) {
    throw new Error('Session token is missing');
  }

  return token;
}

function getSignature(token: string) {
  return (jwt.decode(token, { complete: true }) as { signature: string }).signature;
}
