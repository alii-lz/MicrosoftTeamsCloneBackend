import request from 'sync-request';
import { requestChannelInviteV3, requestChannelAddOwnerV2 } from './channelRequestor';
import { requestChannelsCreateV3 } from './channelsRequestor';
import { port, url } from './config.json';
const SERVER_URL = `${url}:${port}`;
const OK = 200;
const INPUT_ERROR = 400;
const AUTHORIZATION_ERROR = 403;
const ERROR = { error: expect.any(String) };

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

beforeEach(() => {
  request('DELETE', SERVER_URL + '/clear/v1', { json: {} });
});

describe('Tests for /channel/addowner/v2', () => {
  // let user: {token: string, authUserId: number};
  // let channel: {channelId: number};
  // let userToAdd : {token: string, authUserId: number};

  let user: {status: number, returnObj: {token: string, authUserId: number}};
  let channel: {status: number, returnObj: {channelId: number}};
  let userToAdd: {status: number, returnObj: {token: string, authUserId: number}};

  beforeEach(() => {
    user = requestAuthRegister('ali@gmail.com', 'football', 'ali', 'ahmed');
    channel = requestChannelsCreateV3(user.returnObj.token, 'validName', true);

    // creating the user that needs to be added as owner
    userToAdd = requestAuthRegister('jake@gmail.com', 'basketball', 'jake', 'renzella');

    requestChannelInviteV3(user.returnObj.token, channel.returnObj.channelId, userToAdd.returnObj.authUserId);
  });

  test('success case', () => {
    const result = requestChannelAddOwnerV2(user.returnObj.token,
      channel.returnObj.channelId, userToAdd.returnObj.authUserId);
    expect(result.status).toBe(OK);
    expect(result.returnObj).toStrictEqual({});
  });

  test('channelId does not refer to a valid channel', () => {
    try {
      const result = requestChannelAddOwnerV2(user.returnObj.token,
        channel.returnObj.channelId + 100, userToAdd.returnObj.authUserId);

      expect(result.status).toBe(INPUT_ERROR);
      expect(result.returnObj.error).toStrictEqual(expect.any(String));
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('uId does not refer to a valid user', () => {
    try {
      const result = requestChannelAddOwnerV2(user.returnObj.token,
        channel.returnObj.channelId, userToAdd.returnObj.authUserId + 20);

      expect(result.status).toBe(INPUT_ERROR);
      expect(result.returnObj.error).toStrictEqual(expect.any(String));
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
  test('uId refers to a user who is not a member of the channel', () => {
    try {
      const tempUser = requestAuthRegister('temp@gmail.com', 'football', 'temp', 'temp');
      const result = requestChannelAddOwnerV2(user.returnObj.token,
        channel.returnObj.channelId, tempUser.returnObj.authUserID);

      expect(result.status).toBe(INPUT_ERROR);
      expect(result.returnObj.error).toStrictEqual(expect.any(String));
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('uId refers to a user who is already an owner of the channel', () => {
    try {
      const result = requestChannelAddOwnerV2(user.returnObj.token,
        channel.returnObj.channelId, user.returnObj.authUserId);

      expect(result.status).toBe(INPUT_ERROR);
      expect(result.returnObj.error).toStrictEqual(expect.any(String));
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('the authorised user does not have owner permissions in the channel', () => {
    try {
      const result = requestChannelAddOwnerV2(userToAdd.returnObj.token,
        channel.returnObj.channelId, userToAdd.returnObj.authUserId);

      expect(result.status).toBe(AUTHORIZATION_ERROR);
      expect(result.returnObj.error).toStrictEqual(expect.any(String));
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('invalid token', () => {
    try {
      const result = requestChannelAddOwnerV2(user.returnObj.token + 'a',
        channel.returnObj.channelId, userToAdd.returnObj.authUserId);

      expect(result.status).toBe(AUTHORIZATION_ERROR);
      expect(result.returnObj.error).toStrictEqual(expect.any(String));
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});
