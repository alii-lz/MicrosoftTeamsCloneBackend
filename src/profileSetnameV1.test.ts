import request from 'sync-request';

import { port, url } from './config.json';
const SERVER_URL = `${url}:${port}`;

const ERROR = { error: expect.any(String) };

describe('Incorrect testCases', () => {
  let AuthUserId1: {token: string, authUserId: number};

  request('DELETE', SERVER_URL + '/clear/v1', { json: {} });
  const res1 = request(
		'PUT',
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
	AuthUserId1 = JSON.parse(res1.getBody() as string);

//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
test('undefined token', () => {
  const res = request(
    'PUT',
    SERVER_URL + '/user/profile/setname/v1',
    {	
      json: {
        token: undefined,
        nameFisrt: 'Harvey',
        nameLast: 'Plotter',
      }
    }
  );
  const data = JSON.parse(res.getBody() as string);
  expect(data).toStrictEqual({ERROR})});



test('undefined first name', () => {
  const res = request(
    'PUT',
    SERVER_URL + '/user/profile/setname/v1',
    {	
      json: {
        token: AuthUserId1.token,
        nameFisrt: undefined,
        nameLast: 'Plotter',
      }
    }
  );
  const data = JSON.parse(res.getBody() as string);
  expect(data).toStrictEqual({ERROR})});


  test('undefined last name', () => {
    const res = request(
      'PUT',
      SERVER_URL + '/user/profile/setname/v1',
      {	
        json: {
          token: AuthUserId1.token,
          nameFisrt: 'Harvey',
          nameLast: undefined,
        }
      }
    );
    const data = JSON.parse(res.getBody() as string);
    expect(data).toStrictEqual({ERROR})});

  test('invalid token', () => {
    const res = request(
      'PUT',
      SERVER_URL + '/user/profile/setname/v1',
      {	
        json: {
          token: -1,
          nameFisrt: 'Harvey',
          nameLast: 'Plotter',
        }
      }
    );
    const data = JSON.parse(res.getBody() as string);
    expect(data).toStrictEqual({ERROR})});



  test('long first name', () => {
    const res = request(
      'PUT',
      SERVER_URL + '/user/profile/setname/v1',
      {	
        json: {
          token: AuthUserId1.token,
          nameFisrt: 'Harveyfdsjapiofjjiupdefjapjdfiupasueuipashhuidfsa',
          nameLast: 'Plotter',
        }
      }
    );
    const data = JSON.parse(res.getBody() as string);
    expect(data).toStrictEqual({ERROR})});

  test('long last name', () => {
    const res = request(
      'PUT',
      SERVER_URL + '/user/profile/setname/v1',
      {	
        json: {
          token: AuthUserId1.token,
          nameFisrt: 'Harvey',
          nameLast: 'Plotterdfsafdsafijdsnahfinewafdohbewaydholfauewbfaudos',
        }
      }
    );
    const data = JSON.parse(res.getBody() as string);
    expect(data).toStrictEqual({ERROR})});
});






describe('Incorrect testCases', () => {
  let AuthUserId1: {token: string, authUserId: number};
	let AuthUserId2: {token: string, authUserId: number};
  
  request('DELETE', SERVER_URL + '/clear/v1', { json: {} });
  const res1 = request(
		'PUT',
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
	AuthUserId1 = JSON.parse(res1.getBody() as string);

  const res2 = request(
		'PUT',
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
	AuthUserId2 = JSON.parse(res2.getBody() as string);

//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
  test('successful first-last name change', () => {
  const res = request(
    'PUT',
    SERVER_URL + '/user/profile/setname/v1',
    {	
      json: {
        token: AuthUserId1.token,
        nameFisrt: 'Harvey',
        nameLast: 'Plotter',
      }
    }
  );
  const data = JSON.parse(res.getBody() as string);
  expect(data).toStrictEqual({})});


  test('successful test first name change', () => {
    const res = request(
      'PUT',
      SERVER_URL + '/user/profile/setname/v1',
      {	
        json: {
          token: AuthUserId2.token,
          nameFisrt: 'Ronnie',
          nameLast: 'Weasley',
        }
      }
    );
    const data = JSON.parse(res.getBody() as string);
    expect(data).toStrictEqual({})});
});