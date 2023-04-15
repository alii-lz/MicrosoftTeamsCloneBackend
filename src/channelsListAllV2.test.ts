import request from 'sync-request';

import { port, url } from './config.json';
const SERVER_URL = `${url}:${port}`;
const OK = 200;
const INPUT_ERROR = 400;
const AUTHORIZATION_ERROR = 403;

const ERROR = { error: expect.any(String) };

beforeEach(() => {
  request('DELETE', SERVER_URL + '/clear/v1', { json: {} });
});

describe('tests for /channels/listall/v3', () => {
  let user: {token: string, authUserId: number};
  let channel1: {channelId: number};
  let channel2: {channelId: number};

  beforeEach(() => {
    const tempUser = request('POST', SERVER_URL + '/auth/register/v2',
      {
        json: {
          email: 'matthew@gmail.com',
          password: 'validPassword',
          nameFirst: 'matthew',
          nameLast: 'ieong'
        }
      });

    user = JSON.parse(tempUser.getBody() as string);

    const tempChannel = request('POST', SERVER_URL + '/channels/create/v2', {
      json: {
        token: user.token,
        name: 'channel1',
        isPublic: true
      }
    });

    channel1 = JSON.parse(tempChannel.getBody() as string);

    const tempChannel2 = request('POST', SERVER_URL + '/channels/create/v2', {
      json: {
        token: user.token,
        name: 'channel2',
        isPublic: false
      }
    });

    channel2 = JSON.parse(tempChannel2.getBody() as string);
  });

  test('success case', () => {
    const res = request('GET', SERVER_URL + '/channels/listall/v3', { headers: { token: user.token } });

    const data = JSON.parse(res.getBody() as string);

    expect(data).toEqual({
      channels: [
        {
          channelId: channel1.channelId,
          name: 'channel1'
        },
        {
          channelId: channel2.channelId,
          name: 'channel2'
        }
      ],
    });
    expect(res.statusCode).toBe(OK);
  });

  test('invalid token', () => {
    try {
      const res = request('GET', SERVER_URL + '/channels/listall/v3', { headers: { token: 'RANDOM' } });

      const data = JSON.parse(res.getBody() as string);

      expect(data).toEqual(ERROR);
      expect(res.statusCode).toBe(AUTHORIZATION_ERROR);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }
  });
});
