import request from 'sync-request';
import { port, url } from './config.json';
const SERVER_URL = `${url}:${port}`;

export function requestProfileSetnameV2(token: string, nameFirst: string, nameLast: string) {
  const res = request(
    'PUT',
    SERVER_URL + 'user/profile/setname/v2',
    {
      json: {
        token: token,
        nameFirst: nameFirst,
        nameLast: nameLast,
      }
    }
  );
  return { status: res.statusCode, returnObj: JSON.parse(res.getBody() as string) };
}

export function requestProfileSetemailV2(token: string, email: string) {
  const res = request(
    'PUT',
    SERVER_URL + 'user/profile/setemail/v2',
    {
      json: {
        token: token,
        email: email,
      }
    }
  );
  return { status: res.statusCode, returnObj: JSON.parse(res.getBody() as string) };
}

export function requestSethandleStrV2(token: string, handleStr: string) {
  const res = request(
    'PUT',
    SERVER_URL + 'user/profile/sethandle/v2',
    {
      json: {
        token: token,
        handleStr: handleStr,
      }
    }
  );
  return { status: res.statusCode, returnObj: JSON.parse(res.getBody() as string) };
}