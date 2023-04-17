import request from 'sync-request';
import { port, url } from './config.json';
const SERVER_URL = `${url}:${port}`;

export function requestUserProfileV3(token: string, uId: number) {
  const res = request(
    'GET',
    SERVER_URL + '/user/profile/v3',
    {
      qs: {
        uId: uId
      },
      headers: {
        token: token
      },
      timeout: 100
    }
  );
  return { status: res.statusCode, returnObj: JSON.parse(res.body as string) };
}