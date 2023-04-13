import request from 'sync-request';

import { port, url } from './config.json';
const SERVER_URL = `${url}:${port}`;
// let AuthUserId1: { token: string, authUserId: number };
// let AuthUserId2: { token: string, authUserId: number };
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
const AuthUserId1 = JSON.parse(res1.getBody() as string);
const userTok = AuthUserId1.token;
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

request(
  'PUT',
  SERVER_URL + '/user/profile/sethandle/v1',
  {
    json: {
      token: AuthUserId2.token,
      handleStr: 'ronweasley',
    }
  }
);
describe('Incorrect testCases', () => {
  test('undefined token', () => {
    const res = request(
      'PUT',
      SERVER_URL + '/user/profile/sethandle/v1',
      {
        json: {
          token: undefined,
          handleStr: 'harrypotter1',
        }
      }
    );
    const data = JSON.parse(res.getBody() as string);
    expect(data).toStrictEqual({ error: 'Incorrect Arugment use' });
  });

  test('undefined handlestr', () => {
    const res = request(
      'PUT',
      SERVER_URL + '/user/profile/sethandle/v1',
      {
        json: {
          token: AuthUserId1.token,
          handleStr: undefined,
        }
      }
    );
    const data = JSON.parse(res.getBody() as string);
    expect(data).toStrictEqual({ error: 'Incorrect Arugment use' });
  });

  test('< 3 characters', () => {
    const res = request(
      'PUT',
      SERVER_URL + '/user/profile/sethandle/v1',
      {
        json: {
          token: AuthUserId1.token,
          handleStr: 'ha',
        }
      }
    );
    const data = JSON.parse(res.getBody() as string);
    expect(data).toStrictEqual({ error: 'handleStr must be between 3 and 20 characters' });
  });

  test('> 20 characters', () => {
    const res = request(
      'PUT',
      SERVER_URL + '/user/profile/sethandle/v1',
      {
        json: {
          token: AuthUserId1.token,
          handleStr: 'hadfajsojnfjdhsailfhjksahf',
        }
      }
    );
    const data = JSON.parse(res.getBody() as string);
    expect(data).toStrictEqual({ error: 'handleStr must be between 3 and 20 characters' });
  });

  test('not alphanumeric', () => {
    const res = request(
      'PUT',
      SERVER_URL + '/user/profile/sethandle/v1',
      {
        json: {
          token: AuthUserId1.token,
          handleStr: 'h@rrypotter!',
        }
      }
    );
    const data = JSON.parse(res.getBody() as string);
    expect(data).toStrictEqual({ error: 'handleStr must be alphaNumeric' });
  });

  test('not lowercase', () => {
    const res = request(
      'PUT',
      SERVER_URL + '/user/profile/sethandle/v1',
      {
        json: {
          token: userTok,
          handleStr: 'NOTALLOWED',
        }
      }
    );
    const data = JSON.parse(res.getBody() as string);
    expect(data).toStrictEqual({ error: 'Only lower case allowed' });
  });

  test('handleStr is already taken', () => {
    const res = request(
      'PUT',
      SERVER_URL + '/user/profile/sethandle/v1',
      {
        json: {
          token: userTok,
          handleStr: 'ronweasley',
        }
      }
    );
    const data = JSON.parse(res.getBody() as string);
    expect(data).toStrictEqual({ error: 'handleStr has already been taken' });
  });
});

describe('Correct testCases', () => {
  test('Success case 1', () => {
    const res = request(
      'PUT',
      SERVER_URL + '/user/profile/sethandle/v1',
      {
        json: {
          token: AuthUserId1.token,
          handleStr: 'harrypotter1',
        }
      }
    );
    const data = JSON.parse(res.getBody() as string);
    expect(data).toStrictEqual({});
  });

  test('Success case 2', () => {
    const res = request(
      'PUT',
      SERVER_URL + '/user/profile/sethandle/v1',
      {
        json: {
          token: AuthUserId1.token,
          handleStr: 'ronnieweasley',
        }
      }
    );
    const data = JSON.parse(res.getBody() as string);
    expect(data).toStrictEqual({});
  });
});
