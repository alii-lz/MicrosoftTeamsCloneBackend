import request from 'sync-request';
import { port, url } from './config.json';
const SERVER_URL = `${url}:${port}`;

export function requestChannelDetailsV3(token: string, channelId: number) {
  const res = request(
    'GET',
    SERVER_URL + '/channel/details/v3',
    {
      json: {
        token: token,
        channelId: channelId,
      }
    }
  );
  return { status: res.statusCode, returnObj: JSON.parse(res.getBody() as string) };
}

export function requestChannelJoinV3(token: string, channelId: number) {
  const res = request(
    'POST',
    SERVER_URL + '/channel/join/v3',
    {
      json: {
        token: token,
        channelId: channelId,
      }
    }
  );
  return { status: res.statusCode, returnObj: JSON.parse(res.getBody() as string) };
}

export function requestChannelInviteV3(authUserId: number, channelId: number, uId: number) {
  const res = request(
    'POST',
    SERVER_URL + '/channel/invite/v3',
    {
      json: {
        authUserId: authUserId,
        channelId: channelId,
        uId: uId,
      }
    }
  );
  return { status: res.statusCode, returnObj: JSON.parse(res.getBody() as string) };
}

export function requestChannelMessagesV3(token: string, channelId: number, start: number) {
  const res = request(
    'GET',
    SERVER_URL + '/channel/messages/v3',
    {
      json: {
        token: token,
        channelId: channelId,
        start: start,
      }
    }
  );
  return { status: res.statusCode, returnObj: JSON.parse(res.getBody() as string) };
}
