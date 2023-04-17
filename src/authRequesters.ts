import request from 'sync-request';
import { port, url } from './config.json';
const SERVER_URL = `${url}:${port}`;

export function requestAuthRegister(email: string, password: string, nameFirst: string, nameLast: string) {
  const res = request(
    'POST',
    SERVER_URL + '/auth/register/v3',
    {
      json: {
        email: email,
        password: password,
        nameFirst: nameFirst,
        nameLast: nameLast,
      },
      timeout: 100
    }
  );
  return { status: res.statusCode, returnObj: JSON.parse(res.getBody() as string) };
}

export function requestAuthLogin(email: string, password: string) {
  const res = request(
    'POST',
    SERVER_URL + '/auth/login/v3',
    {
      json: {
        email: email,
        password: password,

      },
      timeout: 100
    }
  );
  return { status: res.statusCode, returnObj: JSON.parse(res.getBody() as string) };
}

export function requestAuthLogout(token: string) {
  const res = request(
    'POST',
    SERVER_URL + '/auth/logout/v2',
    {
      headers: {
        token: token,

      },
      timeout: 100
    }
  );
  return { status: res.statusCode, returnObj: JSON.parse(res.getBody() as string) };
}

export function requestAuthPasswordResetRequest(email: string) {
  const res = request(
    'POST',
    SERVER_URL + '/auth/passwordreset/request/v1',
    {
      json: {
        email: email,

      },
      timeout: 100
    }
  );
  return { status: res.statusCode, returnObj: JSON.parse(res.getBody() as string) };
}

export function requestAuthPasswordResetResest(resetCode: string, newPassword: string) {
  const res = request(
    'POST',
    SERVER_URL + '/auth/passwordreset/reset/v1',
    {
      json: {
        resetCode: resetCode,
        newPassword: newPassword

      },
      timeout: 100
    }
  );
  return { status: res.statusCode, returnObj: JSON.parse(res.getBody() as string) };
}
