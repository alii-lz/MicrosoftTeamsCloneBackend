import { toNamespacedPath } from 'path';
import request from 'sync-request';
import { takeCoverage } from 'v8';
import { User } from './interfaces';
import { port, url } from './config.json';
const SERVER_URL = `${url}:${port}`;
const OK = 200;
const ERROR = { error: expect.any(String) };

beforeEach(() => {
  request('DELETE', SERVER_URL + '/clear/v1', { json: {} });
});

describe('Tests for /user/profile/v2', () => {
  let user: {token: string, authUserId: number};

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
    const res = request('GET', SERVER_URL + '/user/profile/v2', {
      qs: {
        token: user.token,
        uId: user.authUserId
      }
    });
    const data = JSON.parse(res.getBody() as string);

    expect(res.statusCode).toBe(OK);
    expect(data).toStrictEqual({

      user: {
        uId: user.authUserId,
        email: 'ali@gmail.com',
        nameFirst: 'ali',
        nameLast: 'ahmed',
        handleStr: 'aliahmed'
      }
    });
  });

  // test('uId does not refer to a valid user', () => {
  //   const res = request('GET', SERVER_URL + '/user/profile/v2', {
  //     qs: {
  //       token: user.token,
  //       uId: user.authUserId + 1
  //     }
  //   });

  //   const data = JSON.parse(res.getBody() as string);

  //   expect(res.statusCode).toBe(OK);
  //   expect(data).toStrictEqual(ERROR);
  // });

  // test('invalid token', () => {
  //   const res = request('GET', SERVER_URL + '/user/profile/v2', {
  //     qs: {
  //       token: 'RANDOM',
  //       uId: user.authUserId
  //     }
  //   });

  //   const data = JSON.parse(res.getBody() as string);
  //   expect(res.statusCode).toBe(OK);
  //   expect(data).toStrictEqual(ERROR);
  // });
});
