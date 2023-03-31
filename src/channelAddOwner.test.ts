import { toNamespacedPath } from 'path';
import request from 'sync-request';
import { takeCoverage } from 'v8';

import { port, url } from './config.json';
const SERVER_URL = `${url}:${port}`;
const OK = 200;

const ERROR = { error: expect.any(String) };

beforeEach(() => {
  request('DELETE', SERVER_URL + '/clear/v1', { json: {} });
});

describe('Tests for /channel/addowner/v1', () => {

	let user: {token: string, authUserId: number};
	let channel: {channelId: number};
	let userToAdd : {token: string, authUserId: number};

	beforeEach(() => {

		// creating the user 
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

		// creating the channel
		const tempChannel =  request('POST', SERVER_URL + '/channels/create/v2', {
      json: {
        token: user.token,
        name: 'ali',
        isPublic: true
      }
    });

		channel = JSON.parse(tempChannel.getBody() as string);

		// creating the user that needs to be added as owner
		const tempUser2 = request('POST', SERVER_URL + '/auth/register/v2', 
			{
				json: {
					email: 'jake@gmail.com',
					password: 'validPassword',
					nameFirst: 'jake',
					nameLast: 'renzella'
				}
			}
		);

		userToAdd = JSON.parse(tempUser.getBody() as string);

		// adding the userToAdd into our channel
		const invite = request('POST', SERVER_URL + '/channel/invite/v2',
			{
				json: {
					token: user.token,
					channelId: channel.channelId,
					uId: userToAdd.authUserId
				}
			}
		);

		// is this line needed?? (line below this comment)
		const joined = JSON.parse(invite.getBody() as string);
	});

  test('success case', () => {

    const res = request('POST', SERVER_URL + '/channel/addowner/v1',{

			json: {
				token: user.token,
				channelId: channel.channelId,
				uId: userToAdd.authUserId
			}
    });

    const data = JSON.parse(res.getBody() as string);

		expect(res.statusCode).toBe(OK);
    expect(data).toStrictEqual({});
  });

	test('channelId does not refer to a valid channel', () => {

    const res = request('POST', SERVER_URL + '/channel/addowner/v1',{

			json: {
				token: user.token,
				channelId: channel.channelId + 1,
				uId: userToAdd.authUserId
			}
    });

    const data = JSON.parse(res.getBody() as string);
		expect(res.statusCode).toBe(OK);
    expect(data).toStrictEqual(ERROR);
  });

	test('uId does not refer to a valid user', () => {

    const res = request('POST', SERVER_URL + '/channel/addowner/v1',{

			json: {
				token: user.token,
				channelId: channel.channelId,
				uId: userToAdd.authUserId + 1
			}
    });

    const data = JSON.parse(res.getBody() as string);
		expect(res.statusCode).toBe(OK);
    expect(data).toStrictEqual(ERROR);
  });

	test('uId refers to a user who is not a member of the channel', () => {

		let notMember: {token: String, authUserId: Number};

		const tempUser3 = request('POST', SERVER_URL + '/auth/register/v2', 
			{
				json: {
					email: 'tony@gmail.com',
					password: 'validPassword',
					nameFirst: 'tony',
					nameLast: 'stark'
				}
		});

		notMember = JSON.parse(tempUser3.getBody() as string);

    const res = request('POST', SERVER_URL + '/channel/addowner/v1',{

			json: {
				token: user.token,
				channelId: channel.channelId,
				uId: notMember.authUserId
			}
    });

    const data = JSON.parse(res.getBody() as string);
		expect(res.statusCode).toBe(OK);
    expect(data).toStrictEqual(ERROR);
  });

	test('uId refers to a user who is already an owner of the channel', () => {

    const res = request('POST', SERVER_URL + '/channel/addowner/v1',{

			json: {
				token: user.token,
				channelId: channel.channelId,
				uId: user.authUserId
			}
    });

    const data = JSON.parse(res.getBody() as string);

		expect(res.statusCode).toBe(OK);
    expect(data).toStrictEqual(ERROR);
  });

	test('the authorised user does not have owner permissions in the channel', () => {
    const res = request('POST', SERVER_URL + '/channel/addowner/v1',{

			json: {
				token: user.token,
				channelId: channel.channelId,
				uId: userToAdd.authUserId
			}
    });

    const data = JSON.parse(res.getBody() as string);
		
		expect(res.statusCode).toBe(OK);
    expect(data).toStrictEqual(ERROR);
  });


	test('invalid token', () => {

    const res = request('POST', SERVER_URL + '/channel/addowner/v1',{

			json: {
				token: 'RANDOM',
				channelId: channel.channelId,
				uId: userToAdd.authUserId
			}
    });

    const data = JSON.parse(res.getBody() as string);
		
		expect(res.statusCode).toBe(OK);
    expect(data).toStrictEqual(ERROR);
  });

});







