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
        handleStr: 'harrypotter1',
      }
    }
  );
  const data = JSON.parse(res.getBody() as string);
  expect(data).toStrictEqual({ERROR})});


  test('undefined handlestr', () => {
    const res = request(
      'PUT',
      SERVER_URL + '/user/profile/setname/v1',
      {	
        json: {
          token: AuthUserId1.token,
          handleStr: undefined,
        }
      }
    );
    const data = JSON.parse(res.getBody() as string);
    expect(data).toStrictEqual({ERROR})});


  test('< 3 characters', () => {
    const res = request(
      'PUT',
      SERVER_URL + '/user/profile/setname/v1',
      {	
        json: {
          token: AuthUserId1.token,
          handleStr: 'ha',
        }
      }
    );
    const data = JSON.parse(res.getBody() as string);
    expect(data).toStrictEqual({ERROR})});

  test('> 20 characters', () => {
    const res = request(
      'PUT',
      SERVER_URL + '/user/profile/setname/v1',
      {	
        json: {
          token: AuthUserId1.token,
          handleStr: 'hadfajsojnfjdhsailfhjksahf',
        }
      }
    );
    const data = JSON.parse(res.getBody() as string);
    expect(data).toStrictEqual({ERROR})});

  test('not alphanumeric', () => {
    const res = request(
      'PUT',
      SERVER_URL + '/user/profile/setname/v1',
      {	
        json: {
          token: AuthUserId1.token,
          handleStr: 'h@rrypotter!',
        }
      }
    );
    const data = JSON.parse(res.getBody() as string);
    expect(data).toStrictEqual({ERROR})});

    
  test('not lowercase', () => {
    const res = request(
      'PUT',
      SERVER_URL + '/user/profile/setname/v1',
      {	
        json: {
          token: AuthUserId1.token,
          handleStr: 'HarryPotter',
        }
      }
    );
    const data = JSON.parse(res.getBody() as string);
    expect(data).toStrictEqual({ERROR})});

  test('handleStr is already taken', () => {
    const res = request(
      'PUT',
      SERVER_URL + '/user/profile/setname/v1',
      {	
        json: {
          token: AuthUserId1.token,
          handleStr: 'ronweasley',
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
test('Success case 1', () => {
    const res = request(
      'PUT',
      SERVER_URL + '/user/profile/setname/v1',
      {	
        json: {
          token: AuthUserId1.token,
          handleStr: 'harrypotter1',
        }
      }
    );
    const data = JSON.parse(res.getBody() as string);
    expect(data).toStrictEqual({})});

  test('Success case 2', () => {
    const res = request(
      'PUT',
      SERVER_URL + '/user/profile/setname/v1',
      {	
        json: {
          token: AuthUserId1.token,
          handleStr: 'ronnieweasley',
        }
      }
    );
    const data = JSON.parse(res.getBody() as string);
    expect(data).toStrictEqual({})});
});