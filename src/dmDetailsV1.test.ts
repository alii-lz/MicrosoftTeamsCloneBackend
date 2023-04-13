import request from 'sync-request';

import { port, url } from './config.json';
const SERVER_URL = `${url}:${port}`;

// const ERROR = { error: expect.any(String) };

request('DELETE', SERVER_URL + '/clear/v1', { json: {} });

const res1 = request(
  'POST',
  SERVER_URL + '/auth/register/v2',
  {
    json: {
      email: 'harry.potter@gmail.com',
      password: 'quidditch',
      nameFirst: 'Harry',
      nameLast: 'Potter'
    }
  }
);
const AuthUserId1Res = JSON.parse(res1.getBody() as string);
const AuthUserId1Token = AuthUserId1Res.token;
const res2 = request(
  'POST',
  SERVER_URL + '/auth/register/v2',
  {
    json: {
      email: 'ron.weasley@gmail.com',
      password: 'flying car',
      nameFirst: 'Ron',
      nameLast: 'Weasley'
    }
  }
);
const AuthUserId2 = JSON.parse(res2.getBody() as string);

const res3 = request(
  'POST',
  SERVER_URL + '/auth/register/v2',
  {
    json: {
      email: 'hermione.granger@gmail.com',
      password: 'reading',
      nameFirst: 'Hermione',
      nameLast: 'Granger'
    }
  }
);
const AuthUserId3 = JSON.parse(res3.getBody() as string);

const res4 = request(
  'POST',
  SERVER_URL + '/dm/create/v1',
  {
    json: {
      token: AuthUserId1Token,
      uIds: [AuthUserId2.authUserId]
    }
  }
);
const dmId1Ans = JSON.parse(res4.getBody() as string);
const dmId1 = dmId1Ans.dmId;
const res5 = request(
  'POST',
  SERVER_URL + '/dm/create/v1',
  {
    json: {
      token: AuthUserId3.token,
      uIds: [AuthUserId2.authUserId]
    }
  }
);
const dmId2Ans = JSON.parse(res5.getBody() as string);
const dmId2 = dmId2Ans.dmId;
/// /////////////////////////////////////////////
/// /////////////////////////////////////////////
/// /////////////////////////////////////////////
describe('Incorrect testCases', () => {
  // let AuthUserId1: {token: string, authUserId: number};
  // let AuthUserId2: {token: string, authUserId: number};
  // let AuthUserId3: {token: string, authUserId: number};
  // let dmId1: {dmId: number};
  // let dmId2: {dmId: number};

  test('undefined token', () => {
    const res = request(
      'GET',
      SERVER_URL + '/dm/details/v1',
      {
        json: {
          token: '',
          dmId: dmId1,
        }
      }
    );
    const data = JSON.parse(res.getBody() as string);
    // console.log('the token is', token )
    // console.log(typeof dmId1)
    expect(data).toStrictEqual({ error: 'Missing Inputs' });
  });

  test('undefined dmId', () => {
    const res = request(
      'GET',
      SERVER_URL + '/dm/details/v1',
      {
        json: {
          token: AuthUserId1Token,
          dmId: null,
        }
      }
    );
    const data = JSON.parse(res.getBody() as string);
    expect(data).toStrictEqual({ error: 'Missing Inputs' });
  });

  test('invalid token', () => {
    const res = request(
      'GET',
      SERVER_URL + '/dm/details/v1',
      {
        qs: {
          token: 'asdf',
          dmId: dmId1,
        }
      }
    );
    const data = JSON.parse(res.getBody() as string);
    expect(data).toStrictEqual({ error: 'Invalid token' });
  });

  test('invalid dmId', () => {
    const res = request(
      'GET',
      SERVER_URL + '/dm/details/v1',
      {
        qs: {
          token: AuthUserId1Token,
          dmId: 123123123123123,
        }
      }
    );
    const data = JSON.parse(res.getBody() as string);
    expect(data).toStrictEqual({ error: 'Invalid dmId' });
  });

  test('valid dmId, but not authorised user (token)', () => {
    const res = request(
      'GET',
      SERVER_URL + '/dm/details/v1',
      {
        qs: {
          token: AuthUserId1Token,
          dmId: dmId2,
        }
      }
    );
    const data = JSON.parse(res.getBody() as string);
    expect(data).toStrictEqual({ error: 'user not in the dm' });
  });
});

describe('Correct testCases', () => {
  // let AuthUserId1: {token: string, authUserId: number};
  // let AuthUserId2: {token: string, authUserId: number};
  // let AuthUserId3: {token: string, authUserId: number};
  // let dmId1: {dmId: number};
  // let dmId2: {dmId: number};

  // request('DELETE', SERVER_URL + '/clear/v1', { json: {} });

  // const res1 = request(
  //   'POST',
  //   SERVER_URL + '/auth/register/v2',
  //   {
  //     json: {
  //       email: 'harry.potter@gmail.com',
  //       password: 'quidditch',
  //       nameFirst: 'Harry',
  //       nameLast: 'Potter'
  //     }
  //   }
  // );
  // const AuthUserId1 = JSON.parse(res1.getBody() as string);

  // const res2 = request(
  //   'POST',
  //   SERVER_URL + '/auth/register/v2',
  //   {
  //     json: {
  //       email: 'ron.weasley@gmail.com',
  //       password: 'flying car',
  //       nameFirst: 'Ron',
  //       nameLast: 'Weasley'
  //     }
  //   }
  // );
  // const AuthUserId2 = JSON.parse(res2.getBody() as string);

  // const res3 = request(
  //   'POST',
  //   SERVER_URL + '/auth/register/v2',
  //   {
  //     json: {
  //       email: 'hermione.granger@gmail.com',
  //       password: 'reading',
  //       nameFirst: 'Hermione',
  //       nameLast: 'Granger'
  //     }
  //   }
  // );
  // const AuthUserId3 = JSON.parse(res3.getBody() as string);

  // const res4 = request(
  //   'POST',
  //   SERVER_URL + '/dm/create/v1',
  //   {
  //     json: {
  //       token: AuthUserId1.token,
  //       uIds: [AuthUserId2.authUserId]
  //     }
  //   }
  // );
  // const dmId1 = JSON.parse(res4.getBody() as string);

  // const res5 = request(
  //   'POST',
  //   SERVER_URL + '/dm/create/v1',
  //   {
  //     json: {
  //       token: AuthUserId3.token,
  //       uIds: [AuthUserId2.authUserId]
  //     }
  //   }
  // );
  // const dmId2 = JSON.parse(res5.getBody() as string);

  /// /////////////////////////////////////////////
  /// /////////////////////////////////////////////
  /// /////////////////////////////////////////////
  test('successful case 1', () => {
    const res = request(
      'GET',
      SERVER_URL + '/dm/details/v1',
      {
        qs: {
          token: AuthUserId1Token,
          dmId: dmId1,
        }
      }
    );
    const data = JSON.parse(res.getBody() as string);
    expect(data).toStrictEqual({
      name: expect.any(String),
      members: expect.any(Array<string>),
    });
  });
  test('successful case 2', () => {
    const res = request(
      'GET',
      SERVER_URL + '/dm/details/v1',
      {
        qs: {
          token: AuthUserId2.token,
          dmId: dmId2,
        }
      }
    );
    const data = JSON.parse(res.getBody() as string);
    expect(data).toStrictEqual({
      name: expect.any(String),
      members: expect.any(Array<string>),
    });
  });
});
