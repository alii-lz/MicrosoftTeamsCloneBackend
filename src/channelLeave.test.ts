import request from 'sync-request';
import { requestChannelsCreateV3 } from './channels.test';
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

export function requestChannelLeaveV2(token: string, channelId: number) {
  const res = request(
    'POST',
    SERVER_URL + '/channels/create/v3',
    {
      json: {
        channelId: channelId
      },
      headers: {
        token: token
      },
      timeout: 100
    }
  );
  return { status: res.statusCode, returnObj: JSON.parse(res.body as string) };
}

beforeEach(() => {
  request('DELETE', SERVER_URL + '/clear/v1', { json: {} });
});

describe('Tests for /channel/leave/v2', () => {

  let user: {status: number, returnObj: {token: string, authUserId: number}};
  let channel: {status: number, returnObj: {channelId: number}};

  beforeEach(() => {

    user = requestAuthRegister('ali@gmail.com', 'football', 'ali', 'ahmed');
    channel = requestChannelsCreateV3(user.returnObj.token, 'validName', true);

  });

  test('success case', () => {

    const result = requestChannelLeaveV2(user.returnObj.token, channel.returnObj.channelId);

    expect(result.status).toBe(OK);
    expect(result.returnObj).toStrictEqual({});
  });

  test('channelId does not refer to a valid channel', () => {

    try {
      const result = requestChannelLeaveV2(user.returnObj.token, channel.returnObj.channelId + 1);
      expect(result.status).toBe(INPUT_ERROR);
      expect(result.returnObj.error).toStrictEqual(expect.any(String));

    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('user is not a member of the channel', () => {
    let notMember: {status: number, returnObj: {token: string, authUserId: number}};

    try {
      notMember = requestAuthRegister('temp@gmail.com', 'football', 'temp', 'random');
      const result = requestChannelLeaveV2(notMember.returnObj.token, channel.returnObj.channelId);
      expect(result.status).toBe(AUTHORIZATION_ERROR);
      expect(result.returnObj.error).toStrictEqual(expect.any(String));
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }

  });

  test('invalid token', () => {

    try {
      const result = requestChannelLeaveV2(user.returnObj.token + 'a', channel.returnObj.channelId);
      expect(result.status).toBe(AUTHORIZATION_ERROR);
      expect(result.returnObj.error).toStrictEqual(expect.any(String));
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});
