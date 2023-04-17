import request, { HttpVerb } from 'sync-request';
import { requestClear } from './clearRequester';
import { port, url } from './config.json';
import { requestAuthRegister, requestAuthLogin, requestAuthLogout } from './authRequesters';

const SERVER_URL = `${url}:${port}`;
const OK = 200;
const INPUT_ERROR = 400;

const ERROR = { error: expect.any(String) };

// Wrapper functions

export function requestChannelsCreateV3(token: string, name: string, isPublic: boolean) {
  const res = request(
    'POST',
    SERVER_URL + '/channels/create/v3',
    {
      json: {
        name: name,
        isPublic: isPublic
      },
      headers: {
        token: token
      },
      timeout: 100
    }
  );
  return { status: res.statusCode, returnObj: JSON.parse(res.getBody() as string) };
}

export function requestChannelsListV3(token: string) {
  const res = request(
    'GET',
    SERVER_URL + '/channels/list/v3',
    {
      headers: {
        token: token
      },
      timeout: 100
    }
  );
  return { status: res.statusCode, returnObj: JSON.parse(res.getBody() as string) };
}

beforeEach(() => {
  requestClear();
});

describe('Tests for /channels/create/v3', () => {
  test('success case', () => {
    const user = requestAuthRegister('ali@gmail.com', 'football', 'ali', 'ahmed');
    const channel = requestChannelsCreateV3(user.returnObj.token, 'validName', true);
    expect(channel.status).toBe(OK);
    expect(channel.returnObj).toStrictEqual({ channelId: expect.any(Number) });
  });

  test('name length less than 1', () => {
    try {
      const user = requestAuthRegister('ali@gmail.com', 'football', 'ali', 'ahmed');
      const channel = requestChannelsCreateV3(user.returnObj.token, '', true);
      expect(channel.returnObj.error).toEqual({ error: expect.any(String) });
      expect(channel.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('name length more than 20', () => {
    try {
      const user = requestAuthRegister('ali@gmail.com', 'football', 'ali', 'ahmed');
      const channel = requestChannelsCreateV3(user.returnObj.token, 'HISNAMEISTOOLONGGGGGGGGGG', true);
      expect(channel.returnObj.error).toEqual({ error: expect.any(String) });
      expect(channel.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('invalid token', () => {
    try {
      const user = requestAuthRegister('ali@gmail.com', 'football', 'ali', 'ahmed');
      const channel = requestChannelsCreateV3(user.returnObj.token + 'a', 'validName', true);
      expect(channel.returnObj.error).toEqual({ error: expect.any(String) });
      expect(channel.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});

describe('Tests for /channels/list/v3', () => {
  // let user: { token: string, authUserId: number };
  // let channel: { channelId: number };

  let user: {status: number, returnObj: {token: string, authUserId: number}};
  let channel: {status: number, returnObj: {channelId: number}};
  beforeEach(() => {
    user = requestAuthRegister('ali@gmail.com', 'football', 'ali', 'ahmed');
    channel = requestChannelsCreateV3(user.returnObj.token, 'validName', true);
  });

  test('success case', () => {
    const result = requestChannelsListV3(user.returnObj.token);

    expect(result.status).toBe(OK);
    expect(result.returnObj).toStrictEqual({
      channels: [
        {
          channelId: channel.returnObj.channelId,
          name: 'validName'
        }
      ]
    });
  });

  test('invalid token', () => {
    const result = requestChannelsListV3(user.returnObj.token + 'a');
    expect(result.status).toBe(OK);
    expect(result.returnObj).toStrictEqual(ERROR);
  });
});
