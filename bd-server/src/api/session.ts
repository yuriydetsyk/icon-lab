import Session from '../../db/models/session';
import { UserData } from '../models/interfaces/user-data';
import { Session as ISession } from '../models/interfaces/session';
import { addDays } from '../helpers/date.helper';

export function addSession(sid: string, user: UserData) {
  return Session.create({
    sid,
    expires: addDays(new Date(), 7),
    data: JSON.stringify(user)
  });
}

export function getSession(sid: string) {
  return Session.findByPk(sid);
}

export function updateSession(data: Partial<ISession> & Pick<ISession, 'sid'>) {
  return Session.update(data, { where: { sid: data.sid } });
}

export function deleteSession(sid: string) {
  return Session.destroy({ where: { sid } });
}

