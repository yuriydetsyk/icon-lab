import { SessionModel } from '../../db/models/session';
import { UserData } from '../models/interfaces/user-data';
import { Session } from '../models/interfaces/session';
import { addDays } from '../helpers/date.helper';

export function addSession(sid: string, user: UserData) {
  return SessionModel.create({
    sid,
    expires: addDays(new Date(), 7),
    data: JSON.stringify(user)
  });
}

export function getSession(sid: string) {
  return SessionModel.findByPk(sid);
}

export function updateSession(data: Partial<Session> & Pick<Session, 'sid'>) {
  return SessionModel.update(data, { where: { sid: data.sid } });
}

export function deleteSession(sid: string) {
  return SessionModel.destroy({ where: { sid } });
}

