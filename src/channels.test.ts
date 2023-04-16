import request, {HttpVerb} from 'sync-request';
import { requestClear } from './clearRequester';
import { port, url } from './config.json';

const SERVER_URL = `${url}:${port}`;
const OK = 200;
const INPUT_ERROR = 400;
const AUTHORIZATION_ERROR = 403;

const ERROR = { error: expect.any(String) };

// Wrapper functions

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
  return { status: res.statusCode, returnObj: JSON.parse(res.body as string) };
}

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
  return { status: res.statusCode, returnObj: JSON.parse(res.body as string) };
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
  return { status: res.statusCode, returnObj: JSON.parse(res.body as string) };
}

beforeEach(() => {
  requestClear();
});

describe('Tests for /channels/create/v3', () => {

  let user: {status: number, returnObj: {token: string, authUserId: number}};
  beforeEach(() => {
    user = requestAuthRegister('ali@gmail.com', 'football', 'ali', 'ahmed');
  });

  test('success case', () => {
    const channel = requestChannelsCreateV3(user.returnObj.token, 'validName', true);
    expect(channel.status).toBe(OK);
    expect(channel.returnObj).toStrictEqual({ channelId: expect.any(Number) });
  });

  test('name length less than 1', () => {

  try {
    const channel = requestChannelsCreateV3(user.returnObj.token, '', true);
    expect(channel.returnObj.error).toEqual(expect.any(String) );
    expect(channel.status).toBe(INPUT_ERROR);
  } catch (error){
    expect(error).toBeInstanceOf(Error);
  }

  });

  test('name length more than 20', () => {
    try {
      const channel = requestChannelsCreateV3(user.returnObj.token, 'THISNAMEISTOOLONGGGGGGGGGG', true);
      expect(channel.returnObj.error).toEqual({ error: expect.any(String) });
      expect(channel.status).toBe(INPUT_ERROR);
    } catch (error){
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('invalid token', () => {
    try {
      const channel = requestChannelsCreateV3(user.returnObj.token + 'a', 'validName', true);
      expect(channel.returnObj.error).toEqual({ error: expect.any(String) });
      expect(channel.status).toBe(AUTHORIZATION_ERROR);
    } catch (error){
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
    try {
      const result = requestChannelsCreateV3(user.returnObj.token + 'a', 'validName', true);
      expect(result.returnObj.error).toEqual(expect.any(String));
      expect(result.status).toBe(AUTHORIZATION_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});

