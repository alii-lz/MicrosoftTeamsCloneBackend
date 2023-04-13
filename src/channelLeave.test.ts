import request from 'sync-request';

import { port, url } from './config.json';
const SERVER_URL = `${url}:${port}`;
const OK = 200;

const ERROR = { error: expect.any(String) };

beforeEach(() => {
  request('DELETE', SERVER_URL + '/clear/v1', { json: {} });
});

describe('Tests for /channel/leave/v1', () => {
  let user: {token: string, authUserId: number};
  let channel: {channelId: number};

  beforeEach(() => {
    const tempUser = request('POST', SERVER_URL + '/auth/register/v2',
      {
        json: {
          email: 'ali@gmail.com',
          password: 'validPassword',
          nameFirst: 'ali',
          nameLast: 'ahmed'
        }
      });

    user = JSON.parse(tempUser.getBody() as string);

    const tempChannel = request('POST', SERVER_URL + '/channels/create/v2', {
      json: {
        token: user.token,
        name: 'ali',
        isPublic: true
      }
    });

    channel = JSON.parse(tempChannel.getBody() as string);
  });

  test('success case', () => {
    const res = request('POST', SERVER_URL + '/channel/leave/v1', {

      json: {
        token: user.token,
        channelId: channel.channelId,
      }
    });

    const data = JSON.parse(res.getBody() as string);

    expect(res.statusCode).toBe(OK);
    expect(data).toStrictEqual({});
  });

  test('channelId does not refer to a valid channel', () => {
    const res = request('POST', SERVER_URL + '/channel/leave/v1', {

      json: {
        token: user.token,
        channelId: channel.channelId + 1,
      }
    });

    const data = JSON.parse(res.getBody() as string);

    expect(res.statusCode).toBe(OK);
    expect(data).toStrictEqual(ERROR);
  });

  test('user is not a member of the channel', () => {
    let notMember = { token: String, authUserId: Number };

    const tempNotMember = request('POST', SERVER_URL + '/auth/register/v2',
      {
        json: {
          email: 'temp@gmail.com',
          password: 'validPassword',
          nameFirst: 'temp',
          nameLast: 'temp'
        }
      });

    notMember = JSON.parse(tempNotMember.getBody() as string);

    const res = request('POST', SERVER_URL + '/channel/leave/v1', {

      json: {
        token: notMember.token,
        channelId: channel.channelId,
      }
    });

    const data = JSON.parse(res.getBody() as string);

    expect(res.statusCode).toBe(OK);
    expect(data).toStrictEqual(ERROR);
  });

  test('invalid token', () => {
    const res = request('POST', SERVER_URL + '/channel/leave/v1', {

      json: {
        token: 'RANDOM',
        channelId: channel.channelId,
      }
    });

    const data = JSON.parse(res.getBody() as string);

    expect(res.statusCode).toBe(OK);
    expect(data).toStrictEqual(ERROR);
  });
});
