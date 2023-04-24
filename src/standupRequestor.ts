import request from 'sync-request';
import { port, url } from './config.json';
const SERVER_URL = `${url}:${port}`;

export function requestStandupStartV1(token: string, channelId: number, length: number) {
  const res = request(
    'POST',
    SERVER_URL + '/standup/start/v1',
    {
      json: {
        channelId: channelId,
        length: length
      },
      headers: {
        token: token
      },
      timeout: 100
    }
  );
  return { status: res.statusCode, returnObj: JSON.parse(res.body as string) };
}

export function requestStandupActiveV1(token: string, channelId: number) {
  const res = request(
    'GET',
    SERVER_URL + '/standup/active/v1',
    {
      qs: {
        channelId: channelId,
      },
      headers: {
        token: token
      },
      timeout: 100
    }
  );
  return { status: res.statusCode, returnObj: JSON.parse(res.body as string) };
}

export function requestStandupSendV1(token: string, channelId: number, message: string) {
  const res = request(
    'GET',
    SERVER_URL + '/standup/send/v1',
    {
      json: {
        channelId: channelId,
        message: message
      },
      headers: {
        token: token
      },
      timeout: 100
    }
  );
  return { status: res.statusCode, returnObj: JSON.parse(res.body as string) };
}
