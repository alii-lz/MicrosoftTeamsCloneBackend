import request from 'sync-request';

import { port, url } from './config.json';
const SERVER_URL = `${url}:${port}`;
const OK = 200;

const ERROR = { error: expect.any(String) };

beforeEach(() => {
  request('DELETE', SERVER_URL + '/clear/v1', { json: {} });
});

describe('Tests for /channels/create/v2', () => {
  let user: { token: string, authUserId: number };

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
  });

  test('success case', () => {
    const res = request('POST', SERVER_URL + '/channels/create/v2',
      {
        json: {
          token: user.token,
          name: 'ali',
          isPublic: true,
        }
      });

    const data = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    expect(data).toStrictEqual({ channelId: expect.any(Number) });
  });

  test('name length less than 1', () => {
    const res = request('POST', SERVER_URL + '/channels/create/v2',
      {
        json: {
          token: user.token,
          name: '',
          isPublic: false,
        }
      });

    const data = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    expect(data).toStrictEqual(ERROR);
  });

  test('name length more than 20', () => {
    const res = request('POST', SERVER_URL + '/channels/create/v2',
      {
        json: {
          token: user.token,
          name: 'qwertyuioplkjhgfdsazxcvbnm',
          isPublic: true,
        }
      });

    const data = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    expect(data).toStrictEqual(ERROR);
  });

  test('invalid token', () => {
    const res = request('POST', SERVER_URL + '/channels/create/v2',
      {
        json: {
          token: 'RANDOM',
          name: 'ali',
          isPublic: true,
        }
      });

    const data = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    expect(data).toStrictEqual(ERROR);
  });
});

describe('Tests for /channels/list/v2', () => {
  let user: { token: string, authUserId: number };
  let channel: { channelId: number };

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
    const tempChannel = request('POST', SERVER_URL + '/channels/create/v2',
      {
        json: {
          token: user.token,
          name: 'ali',
          isPublic: true
        }
      });

    channel = JSON.parse(tempChannel.getBody() as string);
  });

  test('success case', () => {
    const res = request('GET', SERVER_URL + '/channels/list/v2', { qs: { token: user.token } });
    const data = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    expect(data).toEqual({
      channels: [
        {
          channelId: channel.channelId,
          name: 'ali'
        }
      ]
    });
  });

  test('invalid token', () => {
    const res = request('GET', SERVER_URL + '/channels/list/v2', { qs: { token: 'RANDOM' } });
    const data = JSON.parse(res.getBody() as string);
    expect(res.statusCode).toBe(OK);
    expect(data).toEqual(ERROR);
  });
});
