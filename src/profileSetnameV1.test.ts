import request from 'sync-request';

import { port, url } from './config.json';
const SERVER_URL = `${url}:${port}`;

request('DELETE', SERVER_URL + '/clear/v1', { json: {} });
const res1 = request(
  'POST',
  SERVER_URL + '/auth/register/v2',
  {
    json: {
      email: 'harry.potter@gmail.com',
      password: 'quidditch',
      nameFirst: 'Harry',
      nameLast: 'Potter',
    }
  }
);
const AuthUserId1 = JSON.parse(res1.getBody() as string);

describe('Incorrect testCases', () => {
  // let AuthUserId1: {token: string, authUserId: number};
  /// ///////////////////////////////////////////////////////
  /// ///////////////////////////////////////////////////////
  /// ///////////////////////////////////////////////////////
  test('undefined token', () => {
    const res = request(
      'PUT',
      SERVER_URL + '/user/profile/setname/v1',
      {
        json: {
          token: null,
          nameFisrt: 'Harvey',
          nameLast: 'Plotter',
        }
      }
    );
    const data = JSON.parse(res.getBody() as string);
    expect(data).toStrictEqual({ error: 'Incorrect Arugment use' });
  });

  test('undefined first name', () => {
    const res = request(
      'PUT',
      SERVER_URL + '/user/profile/setname/v1',
      {
        json: {
          token: AuthUserId1.token,
          nameFirst: null,
          nameLast: 'Plotter',
        }
      }
    );
    const data = JSON.parse(res.getBody() as string);
    expect(data).toStrictEqual({ error: 'Incorrect Arugment use' });
  });

  test('undefined last name', () => {
    const res = request(
      'PUT',
      SERVER_URL + '/user/profile/setname/v1',
      {
        json: {
          token: AuthUserId1.token,
          nameFirst: 'Harvey',
          nameLast: null,
        }
      }
    );
    const data = JSON.parse(res.getBody() as string);
    expect(data).toStrictEqual({ error: 'Incorrect Arugment use' });
  });

  test('invalid token', () => {
    const res = request(
      'PUT',
      SERVER_URL + '/user/profile/setname/v1',
      {
        json: {
          token: '-1',
          nameFirst: 'Harvey',
          nameLast: 'Plotter',
        }
      }
    );
    const data = JSON.parse(res.getBody() as string);
    expect(data).toStrictEqual({ error: 'Invalid token' });
  });

  test('long first name', () => {
    const res = request(
      'PUT',
      SERVER_URL + '/user/profile/setname/v1',
      {
        json: {
          token: AuthUserId1.token,
          nameFirst: 'Harveyfdsjapiofjjiupdefjapjdfiupasueuipashhuidfsasdasdasd',
          nameLast: 'Plotter',
        }
      }
    );
    const data = JSON.parse(res.getBody() as string);
    expect(data).toStrictEqual({ error: 'First or Last name exceed 50 character' });
  });

  test('long last name', () => {
    const res = request(
      'PUT',
      SERVER_URL + '/user/profile/setname/v1',
      {
        json: {
          token: AuthUserId1.token,
          nameFirst: 'Harvey',
          nameLast: 'Plotterdfsafdsafijdsnahfinewafdohbewaydholfauewbfaudos',
        }
      }
    );
    const data = JSON.parse(res.getBody() as string);
    expect(data).toStrictEqual({ error: 'First or Last name exceed 50 character' });
  });
});

describe('Correct testCases', () => {
  // let AuthUserId1: {token: string, authUserId: number};
  // let AuthUserId2: {token: string, authUserId: number};

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

  const res2 = request(
    'POST',
    SERVER_URL + '/auth/register/v2',
    {
      json: {
        email: 'ron.weasley@gmail.com',
        password: 'flying car',
        nameFirst: 'Ron',
        nameLast: 'Weasley',
      }
    }
  );
  const AuthUserId2 = JSON.parse(res2.getBody() as string);

  /// ///////////////////////////////////////////////////////
  /// ///////////////////////////////////////////////////////
  /// ///////////////////////////////////////////////////////
  test('successful first-last name change', () => {
    const res = request(
      'PUT',
      SERVER_URL + '/user/profile/setname/v1',
      {
        json: {
          token: AuthUserId1.token,
          nameFirst: 'Harvey',
          nameLast: 'Plotter',
        }
      }
    );
    const data = JSON.parse(res.getBody() as string);
    expect(data).toStrictEqual({});
  });

  test('successful test first name change', () => {
    const res = request(
      'PUT',
      SERVER_URL + '/user/profile/setname/v1',
      {
        json: {
          token: AuthUserId2.token,
          nameFirst: 'Ronnie',
          nameLast: 'Weasley',
        }
      }
    );
    const data = JSON.parse(res.getBody() as string);
    expect(data).toStrictEqual({});
  });
});
