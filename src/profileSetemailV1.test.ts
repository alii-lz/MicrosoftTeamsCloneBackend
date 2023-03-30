import request from 'sync-request';

import { port, url } from './config.json';
const SERVER_URL = `${url}:${port}`;

const ERROR = { error: expect.any(String) };

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
  test('undefined token', () => {
    const res = request(
      'PUT',
      SERVER_URL + '/user/profile/setname/v1',
      {	
        json: {
          token: undefined,
          email: 'harvey.plotter@gmail.com',
        }
      }
    );
    const data = JSON.parse(res.getBody() as string);
    expect(data).toStrictEqual({ERROR})});

  test('undefined email', () => {
    const res = request(
      'PUT',
      SERVER_URL + '/user/profile/setname/v1',
      {	
        json: {
          token: AuthUserId1.token,
          email: undefined,
        }
      }
    );
    const data = JSON.parse(res.getBody() as string);
    expect(data).toStrictEqual({ERROR})});

  test('invalid email', () => {
    const res = request(
      'PUT',
      SERVER_URL + '/user/profile/setname/v1',
      {	
        json: {
          token: AuthUserId1.token,
          email: 'harvey.plotter@zxcs.com',
        }
      }
    );
    const data = JSON.parse(res.getBody() as string);
    expect(data).toStrictEqual({ERROR})});

  test('email is already taken', () => {
    const res = request(
      'PUT',
      SERVER_URL + '/user/profile/setname/v1',
      {	
        json: {
          token: AuthUserId1.token,
          email: 'ron.weasley@gmail.com',
        }
      }
    );
    const data = JSON.parse(res.getBody() as string);
    expect(data).toStrictEqual({ERROR})});
});


describe('Correct testCases', () => {
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
  test('successful test 1', () => {
    const res = request(
      'PUT',
      SERVER_URL + '/user/profile/setname/v1',
      {	
        json: {
          token: AuthUserId1.token,
          email: 'harvey.plotter@gmail.com',
        }
      }
    );
    const data = JSON.parse(res.getBody() as string);
    expect(data).toStrictEqual({})});

  test('successful test 2', () => {
    const res = request(
      'PUT',
      SERVER_URL + '/user/profile/setname/v1',
      {	
        json: {
          token: AuthUserId2.token,
          email: 'ronnie.weasley@gmail.com',
        }
      }
    );
    const data = JSON.parse(res.getBody() as string);
    expect(data).toStrictEqual({})});
});