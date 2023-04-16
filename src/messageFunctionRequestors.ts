import request from 'sync-request';
import { port, url } from './config.json';
const SERVER_URL = `${url}:${port}`;

// This file includes requestors for message send, remove, edit and message/senddm.
// Message Send
export function requestMessageSendV2(token: string, channelId: number, message: string) {
  const res = request(
    'POST',
    SERVER_URL + '/message/send/v2',
    {
      headers: {
        token: token,
      },
      json: {
        channelId: channelId,
        message: message,
      }
    }
  )
  return { status: res.statusCode, returnObj: JSON.parse(res.body as string) }
}

// Message Edit
export function requestMessageEditV2(token: string, messageId: number, message: string) {
  let res = request(
    'PUT',
    SERVER_URL + '/message/edit/v2',
    {
      headers: {
        token: token,
      },
      json: {
        messageId: messageId,
        message: message,
      }
    }
  )
  return { status: res.statusCode, returnObj: JSON.parse(res.body as string) };
}
// Message Remove
export function requestMessageRemoveV2(token: string, messageId: number) {
  const res = request(
    'DELETE',
    SERVER_URL + '/message/remove/v2',
    {
      headers: {
        token: token,
      },
      qs: {
        messageId: messageId,
      }
    }
  )
  return { status: res.statusCode, returnObj: JSON.parse(res.body as string) };
}
// Message SendDm
export function requestMessageSendDmV2(token: string, dmId: number, message: string) {
  const res = request(
    'POST',
    SERVER_URL + '/message/senddm/v2',
    {
      headers: {
        token: token,
      },
      json: {
        dmId: dmId,
        message: message,
      }
    }
  )
  return { status: res.statusCode, returnObj: JSON.parse(res.body as string) };
}