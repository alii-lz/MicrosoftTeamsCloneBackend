import request from 'sync-request';
import { port, url } from './config.json';
const SERVER_URL = `${url}:${port}`;

export function requestDmCreate(token: string, uIds: number[]) {
  const res = request(
    'POST',
    SERVER_URL + '/dm/create/v1',
    {
      json: {
        token: token,
        uIds: uIds,
      }
    }
  );
  return { status: res.statusCode, returnObj: JSON.parse(res.getBody() as string) };
}

export function requestDmList(token: string) {
  const res = request(
    'GET',
    SERVER_URL + '/dm/list/v1',
    {
      qs: {
        token: token,
      }
    }
  );
  return { status: res.statusCode, returnObj: JSON.parse(res.getBody() as string) };
}

export function requestDmRemove(token: string, dmId: number) {
  const res = request(
    'DELETE',
    SERVER_URL + '/dm/remove/v1',
    {
      qs: {
        token: token,
        dmId: dmId,
      }
    }
  );
  return { status: res.statusCode, returnObj: JSON.parse(res.getBody() as string) };
}

export function requestDmDetails(token: string, dmId: number) {
  const res = request(
    'GET',
    SERVER_URL + '/dm/details/v1',
    {
      qs: {
        token: token,
        dmId: dmId,
      }
    }
  );
  return { status: res.statusCode, returnObj: JSON.parse(res.getBody() as string) };
}
export function requestDmLeave(token: string, dmId: number) {
  const res = request(
    'POST',
    SERVER_URL + '/dm/leave/v2',
    {
      json: {
        dmId: dmId,
      },
      headers: {
        token: token,
      }
    }
  );
  return { status: res.statusCode, returnObj: JSON.parse(res.getBody() as string) };
}
export function requestDmMessageV1(token: string, dmId: number, start: number) {
  const res = request(
    'GET',
    SERVER_URL + '/dm/messages/v2',
    {
      qs: {
        dmId: dmId,
        start: start
      },
      headers: {
        token: token,
      }
    }
  );
  return { status: res.statusCode, returnObj: JSON.parse(res.getBody() as string) };
}

export function requestMessageSendDM(token: string, dmId: number, message: string) {
  const res = request(
    'POST',
    SERVER_URL + '/message/senddm/v2',
    {
      json: {
        dmId: dmId,
        message: message
      },
      headers: {
        token: token,
      }
    }
  );
  return { status: res.statusCode, returnObj: JSON.parse(res.getBody() as string) };
}
