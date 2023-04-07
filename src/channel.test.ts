import request from 'sync-request';
import { port, url } from './config.json';

const SERVER_URL = `${url}:${port}`;
const ERROR = { error: expect.any(String) };

describe('channelDetailsV1(token, channelId)', () => {
	let AuthUserId1: {token: string, authUserId: number};
	let AuthUserId2: {token: string, authUserId: number};
	let AuthUserId3: {token: string, authUserId: number};
	let ChannelId1: {channelId: number};
	let ChannelId3: {channelId: number};


	beforeEach(() => {
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
		AuthUserId1 = JSON.parse(res1.getBody() as string);

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
		AuthUserId2 = JSON.parse(res2.getBody() as string);

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
		AuthUserId3 = JSON.parse(res3.getBody() as string);

		const res4 = request(
			'POST',
			SERVER_URL + '/channels/create/v2',
			{
				json: {
					token: AuthUserId1.token[0],
					name: 'Quidditch League',
					isPublic: true,
				}
			}
		);
		ChannelId1 = JSON.parse(res4.getBody() as string);

		const res6 = request(
			'POST',
			SERVER_URL + '/channels/create/v2',
				{
				json: {
					token: AuthUserId3.token,
					name: 'Hermione Fan Club',
					isPublic: true,
				}
			}
		);
		ChannelId3 = JSON.parse(res6.getBody() as string);
	});

	////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////
	test('Missing token', () => {
		const res = request(
			'GET',
			SERVER_URL + '/channel/details/v2',
			{	
				qs: {
					token: undefined,
					channelId: ChannelId1.channelId,
				}
			}
		);
		const data = JSON.parse(res.getBody() as string);
		expect(data).toStrictEqual(ERROR)});


	test('Missing ChannelId1', () => {
		const res = request(
			'GET',
			SERVER_URL + '/channel/details/v2',
			{	
				qs: {
					token: AuthUserId1.token,
					channelId: undefined,
				}
			}
		);
		const data = JSON.parse(res.getBody() as string);
		expect(data).toStrictEqual(ERROR)});


	test('Invalid Token (not in storeData)', () => {
		const res = request(
			'GET',
			SERVER_URL + '/channel/details/v2',
			{	
				qs: {
					token: 111,
					channelId: ChannelId1.channelId,
				}
			}
		);
		const data = JSON.parse(res.getBody() as string);
		expect(data).toStrictEqual(ERROR)});


	test('Invalid ChannelId (not in storeData)', () => {
		const res = request(
			'GET',
			SERVER_URL + '/channel/details/v2',
			{	
				qs: {
					token: AuthUserId1.token,
					channelId: 1010,
				}
			}
		);
		const data = JSON.parse(res.getBody() as string);
		expect(data).toStrictEqual(ERROR);


	test('AuthUserId is not a member of the channel', () => {
		const res = request(
			'GET',
			SERVER_URL + '/channel/details/v2',
			{	
				qs: {
					token: AuthUserId2.token,
					channelId: ChannelId3.channelId,
				}
			}
		);
		const data = JSON.parse(res.getBody() as string);
		expect(data).toStrictEqual(ERROR)});
				
	
	test('Successful test 1', () => {
		const res = request(
			'GET',
			SERVER_URL + '/channel/details/v2',
			{	
				qs: {
					token: AuthUserId1.token,
					channelId: ChannelId1.channelId,
				}
			}
		);
		const data = JSON.parse(res.getBody() as string);
		expect(data).toStrictEqual({
			name: 'Quidditch League',
			isPublic: true,
			ownerMembers: [
				{
					uId: expect.any(Number),
					email: 'harry.potter@gmail.com',
					nameFirst: 'Harry',
					nameLast: 'Potter',
					handleStr: 'harrypotter',
				}
			],
			allMembers: [
				{
					uId: expect.any(Number),
					email: 'harry.potter@gmail.com',
					nameFirst: 'Harry',
					nameLast: 'Potter',
					handleStr: 'harrypotter',
				}
			],
		});
	});
});

	test('Successful test 2', () => {
		const res = request(
			'GET',
			SERVER_URL + '/channel/details/v2',
			{	
				qs: {
					token: AuthUserId3.token,
					channelId: ChannelId3.channelId,
				}
			}
		);
		const data = JSON.parse(res.getBody() as string);
		expect(data).toStrictEqual({
			name: 'Hermione Fan Club',
			isPublic: true,
			ownerMembers: [
				{
					uId: expect.any(Number),
					email: 'hermione.granger@gmail.com',
					nameFirst: 'Hermione',
					nameLast: 'Granger',
					handleStr: 'hermionegranger'
				}
			],
			allMembers: [
				{
					uId: expect.any(Number),
					email: 'hermione.granger@gmail.com',
					nameFirst: 'Hermione',
					nameLast: 'Granger',
					handleStr: 'hermionegranger',
				}
			],
		});
	});
});

	
// /// ///// channelJoinV1 ////////
// describe('channelJoinV1(authUserId, channelId): Invalid Inputs', () => {
// 	let AuthUserId1: {token: string, authUserId: number};
// 	let AuthUserId2: {token: string, authUserId: number};
// 	let AuthUserId3: {token: string, authUserId: number};
// 	let ChannelId1: {channelId: number};
// 	let ChannelId3: {channelId: number};
// 	beforeEach(() => {
//   	request('DELETE', SERVER_URL + '/clear/v1', { json: {} });
// 		const res1 = request(
// 			'POST',
// 			SERVER_URL + '/auth/register/v2',
// 			{
// 				json: {
// 					email: 'harry.potter@gmail.com',
// 					password: 'quidditch',
// 					nameFirst: 'Harry',
// 					nameLast: 'Potter'
// 				}
// 			}
// 		);
// 		AuthUserId1 = JSON.parse(res1.getBody() as string);

// 		const res2 = request(
// 			'POST',
// 			SERVER_URL + '/auth/register/v2',
// 			{
// 				json: {
// 					email: 'ron.weasley@gmail.com',
// 					password: 'flying car',
// 					nameFirst: 'Ron',
// 					nameLast: 'Weasley'
// 				}
// 			}
// 		);
// 		AuthUserId2 = JSON.parse(res2.getBody() as string);

// 		const res3 = request(
// 			'POST',
// 			SERVER_URL + '/auth/register/v2',
// 			{
// 				json: {
// 					email: 'hermione.granger@gmail.com',
// 					password: 'reading',
// 					nameFirst: 'Hermione',
// 					nameLast: 'Granger'
// 				}
// 			}
// 		);
// 		AuthUserId3 = JSON.parse(res3.getBody() as string);

// 		const res4 = request(
// 			'POST',
// 			SERVER_URL + '/channels/create/v2',
// 			{
// 				json: {
// 					token: AuthUserId1.token,
// 					name: 'Quidditch League',
// 					isPublic: true,
// 				}
// 			}
// 		);
// 		ChannelId1 = JSON.parse(res4.getBody() as string);

// 		const res6 = request(
// 			'POST',
// 			SERVER_URL + '/channels/create/v2',
// 				{
// 				json: {
// 					token: AuthUserId3.token,
// 					name: 'Hermione Fan Club',
// 					isPublic: true,
// 				}
// 			}
// 		);
// 		ChannelId3 = JSON.parse(res6.getBody() as string);
// 	});
// 	////////////////////////////////////////////////////////
// 	////////////////////////////////////////////////////////
// 	////////////////////////////////////////////////////////
	
// 	test('Missing token', () => {
// 		const res = request(
// 			'POST',
// 			SERVER_URL + '/channel/join/v2',
// 			{	
// 				qs: {
// 					token: undefined,
// 					channelId: ChannelId1.channelId,
// 				}
// 			}
// 		);
// 		const data = JSON.parse(res.getBody() as string);
// 		expect(data).toStrictEqual(ERROR)});

// 	test('Missing ChannelId1', () => {
// 		const res = request(
// 			'POST',
// 			SERVER_URL + '/channel/join/v2',
// 			{	
// 				qs: {
// 					token: AuthUserId1.token,
// 					channelId: undefined,
// 				}
// 			}
// 		);
// 		const data = JSON.parse(res.getBody() as string);
// 		expect(data).toStrictEqual(ERROR)});


// 	test('Invalid Token (not in storeData)', () => {
// 		const res = request(
// 			'POST',
// 			SERVER_URL + '/channel/join/v2',
// 			{	
// 				qs: {
// 					token: 111,
// 					channelId: ChannelId1.channelId,
// 				}
// 			}
// 		);
// 		const data = JSON.parse(res.getBody() as string);
// 		expect(data).toStrictEqual(ERROR)});


// 	test('Invalid ChannelId (not in storeData)', () => {
// 		const res = request(
// 			'POST',
// 			SERVER_URL + '/channel/join/v2',
// 			{	
// 				qs: {
// 					token: AuthUserId1.token,
// 					channelId: 1010,
// 				}
// 			}
// 		);
// 		const data = JSON.parse(res.getBody() as string);
// 		expect(data).toStrictEqual(ERROR)});

		
// 	test('test successsful 1', () => {
// 		const res = request(
// 			'POST',
// 			SERVER_URL + '/channel/join/v2',
// 			{	
// 				qs: {
// 					token: AuthUserId2.token,
// 					channelId: ChannelId3.channelId,
// 				}
// 			}
// 		);
// 		const data = JSON.parse(res.getBody() as string);
// 		expect(data).toStrictEqual({})});

  test('test successsful 2', () => {
    const res = request(
      'POST',
      SERVER_URL + '/channel/join/v2',
      {
        qs: {
          token: AuthUserId3.token,
          channelId: ChannelId1.channelId,
        }
      }
    );
    const data = JSON.parse(res.getBody() as string);
    expect(data).toStrictEqual({});
  });
});
