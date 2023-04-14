import request from 'sync-request';
import { port, url } from './config.json';
const SERVER_URL = `${url}:${port}`;

export function requestAuthRegister(email: string, password: string, nameFirst: string, nameLast: string) {
  const res = request(
    'POST',
    SERVER_URL + '/auth/register/v2',
    {
      json: {
        email: email,
        password: password,
        nameFirst: nameFirst,
        nameLast: nameLast,
      }
    }
  );
  return { status: res.statusCode, returnObj: JSON.parse(res.getBody() as string) };
}

export function requestAuthLogin(email: string, password: string) {
  const res = request(
    'POST',
    SERVER_URL + '/auth/login/v2',
    {
      json: {
        email: email,
        password: password,

      }
    }
  );
  return { status: res.statusCode, returnObj: JSON.parse(res.getBody() as string) };
}

export function requestAuthLogout(token: string) {
  const res = request(
    'POST',
    SERVER_URL + '/auth/logout/v1',
    {
      json: {
        token: token,

      }
    }
  );
  return { status: res.statusCode, returnObj: JSON.parse(res.getBody() as string) };
}
