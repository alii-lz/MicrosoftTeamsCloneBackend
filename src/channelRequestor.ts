import request from 'sync-request';
import { port, url } from './config.json';
const SERVER_URL = `${url}:${port}`;

export function requestChannelDetailsV3(token: string, channelId: number) {
  const res = request(
    'GET',
    SERVER_URL + '/channel/details/v3',
    {
      qs: {
        token: token,
      },
      json: {
        channelId: channelId,
      }
    }
  );
  return { status: res.statusCode, returnObj: JSON.parse(res.body as string) };
}

export function requestChannelJoinV3(token: string, channelId: number) {
  const res = request(
    'POST',
    SERVER_URL + '/channel/join/v3',
    {
      headers: {
        token: token,
      },
      json: {
        channelId: channelId,
      }
    }
  );
  return { status: res.statusCode, returnObj: JSON.parse(res.body as string) };
}

export function channelInviteV3(token: string, channelId: number, uId: number) {
  const res = request(
    'POST',
    SERVER_URL + '/channel/invite/v3',
    {
      headers: {
        token: token,
      },
      json: {
        channelId: channelId,
        uId: uId,
      }
    }
  );
  return { status: res.statusCode, returnObj: JSON.parse(res.body as string) };
}

export function requestChannelMessagesV3(token: string, channelId: number, start: number) {
  const res = request(
    'GET',
    SERVER_URL + '/channel/messages/v3',
    {
      headers: {
        token: token,
      },
      qs: {
        channelId: channelId,
        start: start,
      }
    }
  );
  return { status: res.statusCode, returnObj: JSON.parse(res.body as string) };
}
