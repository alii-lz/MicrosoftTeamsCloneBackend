import request from 'sync-request';

import { port, url } from './config.json';
const SERVER_URL = `${url}:${port}`;
const OK = 200;

const ERROR = { error: expect.any(String) };

beforeEach(() => {
  request('DELETE', SERVER_URL + '/clear/v1', { json: {} });
});

describe('tests for /channels/listall/v2', () => {
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

    const tempChannel = request('POST', SERVER_URL + '/channel/create/v2', {
      json: {
        token: user.token,
        name: 'channel1',
        isPublic: true
      }
    });

    channel1 = JSON.parse(tempChannel.getBody() as string);

    const tempChannel2 = request('POST', SERVER_URL + '/channel/create/v2', {
      json: {
        token: user.token,
        name: 'channel2',
        isPublic: false
      }
    });

    channel2 = JSON.parse(tempChannel2.getBody() as string);
  });

  test('success case', () => {
    const res = request('GET', SERVER_URL + '/channels/listall/v2', { qs: { token: user.token } });

    const data = JSON.parse(res.getBody() as string);

    expect(res.statusCode).toBe(OK);
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
  });

  test('invalid token', () => {
    const res = request('GET', SERVER_URL + '/channels/listall/v2', { qs: { token: 'RANDOM' } });

    const data = JSON.parse(res.getBody() as string);

    expect(res.statusCode).toBe(OK);
    expect(data).toEqual(ERROR);
  });
});