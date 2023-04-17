import request from 'sync-request';
import { port, url } from './config.json';
const SERVER_URL = `${url}:${port}`;

export function requestSendlaterV1(token: string, channelId: number, message: string, timeSent: number) {
  const res = request(
    'POST',
    SERVER_URL + '/message/sendlater/v1',
    {
      headers: {
        token: token
      },
      json: {
        channelId: channelId,
        message: message,
        timeSent: timeSent,
      }
    }
  );
  console.log(res);
  return { status: res.statusCode, returnObj: JSON.parse(res.getBody() as string) };
}

export function sendlaterdmV1(token: string, dmId: number, message: string, timeSent: number) {
  const res = request(
    'POST',
    SERVER_URL + '/message/sendlaterdm/v1',
    {
      headers: {
        token: token
      },
      json: {
        dmId: dmId,
        message: message,
        timeSent: timeSent,
      }
    }
  );
  return { status: res.statusCode, returnObj: JSON.parse(res.getBody() as string) };
}
