import { requestAuthRegister } from './authRequesters';
import { requestChannelsCreateV3 } from './channels.test';
import { requestClear } from './clearRequester';
import { channelDetailsV2, channelJoinV2 } from './channel';

const OK = 200;
const INPUT_ERROR = 400;
const AUTHORIZATION_ERROR = 403;

let AuthUserId1: { token: string, authUserId: number };
let AuthUserId2: { token: string, authUserId: number };
let AuthUserId3: { token: string, authUserId: number };

let ChannelId1: { channelId: number} ;
let ChannelId2: { channelId: number };
let ChannelId3: { channelId: number };

describe('channel/details/v3 failure tests', () => {
  beforeEach(() => {
    requestClear();
    // Initalize AuthUserIds
    const AuthUserId1_return = requestAuthRegister('harry.potter@gmail.com', 'quidditch', 'Harry', 'Potter');
    AuthUserId1 = AuthUserId1_return.returnObj;
    const AuthUserId2_return = requestAuthRegister('aaaaaa@gmail.com', 'asdadasdasdadsa', 'asdasd', 'asdasdasd');
    AuthUserId2 = AuthUserId2_return.returnObj;
    const AuthUserId3_return = requestAuthRegister('hermione.granger@gmail.com', 'reading', 'Hermione', 'Granger');
    AuthUserId3 = AuthUserId3_return.returnObj;

    // Initalize channels
    const channelId1_return = requestChannelsCreateV3(AuthUserId1.token, 'Quidditch League', true);
    ChannelId1 = channelId1_return.returnObj;
    const channelId2_return = requestChannelsCreateV3(AuthUserId3.token, 'Hermione Fan Club', true);
    ChannelId3 = channelId2_return.returnObj;
  });

  test('Test 1: Undefined token', () => {
    try {
      const result = channelDetailsV2(undefined, ChannelId1.channelId);
      expect(result.returnObj.error).toEqual({ error: expect.any(String) });
      expect(result.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Test 2: Undefined channel', () => {
    try {
      const result = channelDetailsV2(AuthUserId1.token, undefined);
      expect(result.returnObj.error).toEqual({ error: expect.any(String) });
      expect(result.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Test 3: Invalid Token (not in storeData)', () => {
    try {
      const result = channelDetailsV2('111', ChannelId1.channelId);
      expect(result.returnObj.error).toEqual({ error: expect.any(String) });
      expect(result.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Test 4: Invalid ChannelId (not in storeData)', () => {
    try {
      const result = channelDetailsV2(AuthUserId1.token, 1010);
      expect(result.returnObj.error).toEqual({ error: expect.any(String) });
      expect(result.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Test 5: AuthUserId is not a member of the channel', () => {
    try {
      const result = channelDetailsV2(AuthUserId2.token, ChannelId3.channelId);
      expect(result.returnObj.error).toEqual({ error: expect.any(String) });
      expect(result.status).toBe(AUTHORIZATION_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});

describe('channel/details/v3 success tests', () => {
  beforeEach(() => {
    requestClear();
    // Initalize AuthUserIds
    const AuthUserId1_return = requestAuthRegister('harry.potter@gmail.com', 'quidditch', 'Harry', 'Potter');
    AuthUserId1 = AuthUserId1_return.returnObj;
    const AuthUserId2_return = requestAuthRegister('aaaaaa@gmail.com', 'asdadasdasdadsa', 'asdasd', 'asdasdasd');
    AuthUserId2 = AuthUserId2_return.returnObj;
    const AuthUserId3_return = requestAuthRegister('hermione.granger@gmail.com', 'reading', 'Hermione', 'Granger');
    AuthUserId3 = AuthUserId3_return.returnObj;

    // Initalize channels
    const channelId1_return = requestChannelsCreateV3(AuthUserId1.token, 'Quidditch League', true);
    ChannelId1 = channelId1_return.returnObj;
    const channelId2_return = requestChannelsCreateV3(AuthUserId3.token, 'Hermione Fan Club', true);
    ChannelId3 = channelId2_return.returnObj;
  });

  test('Test 1: Success', () => {
    const result = channelDetailsV2(AuthUserId1.token, ChannelId1.channelId);
    expect(result.returnObj).toStrictEqual({
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
    expect(result.status).toBe(OK);
  });

  test('Test 2: Success', () => {
    const result = channelDetailsV2(AuthUserId3.token, ChannelId3.channelId);
    expect(result.returnObj).toStrictEqual({
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
    expect(result.status).toBe(OK);
  });
});

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

describe('channel/join/v3 failure tests', () => {
  beforeEach(() => {
    requestClear();
    // Initalize AuthUserIds
    const AuthUserId1_return = requestAuthRegister('harry.potter@gmail.com', 'quidditch', 'Harry', 'Potter');
    AuthUserId1 = AuthUserId1_return.returnObj;
    const AuthUserId2_return = requestAuthRegister('ron.weasley@gmail.com', 'flying car', 'Ron', 'Weasley');
    AuthUserId2 = AuthUserId2_return.returnObj;
    const AuthUserId3_return = requestAuthRegister('hermione.granger@gmail.com', 'reading', 'Hermione', 'Granger');
    AuthUserId3 = AuthUserId3_return.returnObj;

    // Initalize channels
    const channelId1_return = requestChannelsCreateV3(AuthUserId1.token, 'Quidditch League', true);
    ChannelId1 = channelId1_return.returnObj;
    const channelId2_return = requestChannelsCreateV3(AuthUserId2.token, 'The Weasleys', false);
    ChannelId2 = channelId2_return.returnObj
    const channelId3_return = requestChannelsCreateV3(AuthUserId3.token, 'Hermione Fan Club', true);
    ChannelId3 = channelId3_return.returnObj;
  });
  test('Test 1: Undefined token', () => {
    try {
      const result = channelJoinV2(undefined, ChannelId1.channelId);
      expect(result.returnObj.error).toEqual({ error: expect.any(String) });
      expect(result.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Test 2: Undefined channel', () => {
    try {
      const result = channelJoinV2(AuthUserId1.token, undefined);
      expect(result.returnObj.error).toEqual({ error: expect.any(String) });
      expect(result.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Test 3: Invalid Token (not in storeData)', () => {
    try {
      const result = channelJoinV2('111', ChannelId1.channelId);
      expect(result.returnObj.error).toEqual({ error: expect.any(String) });
      expect(result.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Test 4: Invalid ChannelId (not in storeData)', () => {
    try {
      const result = channelJoinV2(AuthUserId1.token, 1010);
      expect(result.returnObj.error).toEqual({ error: expect.any(String) });
      expect(result.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Test 5: AuthUser cannot join a private channel', () => {
    try {
      const result = channelJoinV2(AuthUserId3.token, ChannelId2.channelId);
      expect(result.returnObj.error).toEqual({ error: expect.any(String) });
      expect(result.status).toBe(AUTHORIZATION_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});

describe('channel/join/v3 success tests', () => {
  beforeEach(() => {
    requestClear();
    // Initalize AuthUserIds
    const AuthUserId1_return = requestAuthRegister('harry.potter@gmail.com', 'quidditch', 'Harry', 'Potter');
    AuthUserId1 = AuthUserId1_return.returnObj;
    const AuthUserId2_return = requestAuthRegister('ron.weasley@gmail.com', 'flying car', 'Ron', 'Weasley');
    AuthUserId2 = AuthUserId2_return.returnObj;
    const AuthUserId3_return = requestAuthRegister('hermione.granger@gmail.com', 'reading', 'Hermione', 'Granger');
    AuthUserId3 = AuthUserId3_return.returnObj;

    // Initalize channels
    const channelId1_return = requestChannelsCreateV3(AuthUserId1.token, 'Quidditch League', true);
    ChannelId1 = channelId1_return.returnObj;
    const channelId2_return = requestChannelsCreateV3(AuthUserId2.token, 'The Weasleys', false);
    ChannelId2 = channelId2_return.returnObj
    const channelId3_return = requestChannelsCreateV3(AuthUserId3.token, 'Hermione Fan Club', true);
    ChannelId3 = channelId3_return.returnObj;
  });
  test('Test 1: Success', () => {
    const result = channelDetailsV2(AuthUserId2.token, ChannelId3.channelId);
    expect(result.returnObj).toStrictEqual({});
    expect(result.status).toBe(OK);
  });

  test('Test 2: Success', () => {
    const result = channelDetailsV2(AuthUserId3.token, ChannelId1.channelId);
    expect(result.returnObj).toStrictEqual({});
    expect(result.status).toBe(OK);
  });
});















// import request from 'sync-request';
// import { port, url } from './config.json';

// const SERVER_URL = `${url}:${port}`;
// const ERROR = { error: expect.any(String) };

// describe('channelDetailsV1(token, channelId)', () => {
//   let AuthUserId1: { token: string, authUserId: number };
//   // let AuthUserId2: { token: string, authUserId: number };
//   let AuthUserId3: { token: string, authUserId: number };
//   let ardenTok: { token: string, authUserId: number };
//   let ChannelId1: { channelId: number };
//   let ChannelId3: { channelId: number };

//   beforeEach(() => {
//     request('DELETE', SERVER_URL + '/clear/v1', { json: {} });
//     const arden = request(
//       'POST',
//       SERVER_URL + '/auth/register/v2',
//       {
//         json: {
//           email: 'aaaaaa@gmail.com',
//           password: 'asdadasdasdadsa',
//           nameFirst: 'asdasd',
//           nameLast: 'asdasdasd'
//         }
//       }
//     );
//     ardenTok = JSON.parse(arden.getBody() as string);
//     const res1 = request(
//       'POST',
//       SERVER_URL + '/auth/register/v2',
//       {
//         json: {
//           email: 'harry.potter@gmail.com',
//           password: 'quidditch',
//           nameFirst: 'Harry',
//           nameLast: 'Potter'
//         }
//       }
//     );
//     AuthUserId1 = JSON.parse(res1.getBody() as string);

//     // const res2 = request(
//     //   'POST',
//     //   SERVER_URL + '/auth/register/v2',
//     //   {
//     //     json: {
//     //       email: 'ron.weasley@gmail.com',
//     //       password: 'flying car',
//     //       nameFirst: 'Ron',
//     //       nameLast: 'Weasley'
//     //     }
//     //   }
//     // );
//     // AuthUserId2 = JSON.parse(res2.getBody() as string);

//     const res3 = request(
//       'POST',
//       SERVER_URL + '/auth/register/v2',
//       {
//         json: {
//           email: 'hermione.granger@gmail.com',
//           password: 'reading',
//           nameFirst: 'Hermione',
//           nameLast: 'Granger'
//         }
//       }
//     );
//     AuthUserId3 = JSON.parse(res3.getBody() as string);

//     const res4 = request(
//       'POST',
//       SERVER_URL + '/channels/create/v2',
//       {
//         json: {
//           token: AuthUserId1.token,
//           name: 'Quidditch League',
//           isPublic: true,
//         }
//       }
//     );
//     ChannelId1 = JSON.parse(res4.getBody() as string);

//     const res6 = request(
//       'POST',
//       SERVER_URL + '/channels/create/v2',
//       {
//         json: {
//           token: AuthUserId3.token,
//           name: 'Hermione Fan Club',
//           isPublic: true,
//         }
//       }
//     );
//     ChannelId3 = JSON.parse(res6.getBody() as string);
//   });

//   /// /////////////////////////////////////////////////////
//   /// /////////////////////////////////////////////////////
//   /// /////////////////////////////////////////////////////
//   test('Missing token', () => {
//     const res = request(
//       'GET',
//       SERVER_URL + '/channel/details/v2',
//       {
//         qs: {
//           token: undefined,
//           channelId: ChannelId1.channelId,
//         }
//       }
//     );
//     const data = JSON.parse(res.getBody() as string);
//     expect(data).toStrictEqual(ERROR);
//   });

//   test('Missing ChannelId1', () => {
//     const res = request(
//       'GET',
//       SERVER_URL + '/channel/details/v2',
//       {
//         qs: {
//           token: AuthUserId1.token,
//           channelId: undefined,
//         }
//       }
//     );
//     const data = JSON.parse(res.getBody() as string);
//     expect(data).toStrictEqual(ERROR);
//   });

//   test('Invalid Token (not in storeData)', () => {
//     const res = request(
//       'GET',
//       SERVER_URL + '/channel/details/v2',
//       {
//         qs: {
//           token: 111,
//           channelId: ChannelId1.channelId,
//         }
//       }
//     );
//     const data = JSON.parse(res.getBody() as string);
//     expect(data).toStrictEqual(ERROR);
//   });

//   test('Invalid ChannelId (not in storeData)', () => {
//     const res = request(
//       'GET',
//       SERVER_URL + '/channel/details/v2',
//       {
//         qs: {
//           token: AuthUserId1.token,
//           channelId: 1010,
//         }
//       }
//     );
//     const data = JSON.parse(res.getBody() as string);
//     expect(data).toStrictEqual(ERROR);
//   });

//   test('AuthUserId is not a member of the channel', () => {
//     const res = request(
//       'GET',
//       SERVER_URL + '/channel/details/v2',
//       {
//         qs: {
//           token: ardenTok.token,
//           channelId: ChannelId3.channelId,
//         }
//       }
//     );
//     const data = JSON.parse(res.getBody() as string);
//     expect(data).toStrictEqual(ERROR);
//   });

//   test('Successful test 1', () => {
//     const res = request(
//       'GET',
//       SERVER_URL + '/channel/details/v2',
//       {
//         qs: {
//           token: AuthUserId1.token,
//           channelId: ChannelId1.channelId,
//         }
//       }
//     );
//     const data = JSON.parse(res.getBody() as string);
//     expect(data).toStrictEqual({
//       name: 'Quidditch League',
//       isPublic: true,
//       ownerMembers: [
//         {
//           uId: expect.any(Number),
//           email: 'harry.potter@gmail.com',
//           nameFirst: 'Harry',
//           nameLast: 'Potter',
//           handleStr: 'harrypotter',
//         }
//       ],
//       allMembers: [
//         {
//           uId: expect.any(Number),
//           email: 'harry.potter@gmail.com',
//           nameFirst: 'Harry',
//           nameLast: 'Potter',
//           handleStr: 'harrypotter',
//         }
//       ],
//     });
//   });

//   test('Successful test 2', () => {
//     const res = request(
//       'GET',
//       SERVER_URL + '/channel/details/v2',
//       {
//         qs: {
//           token: AuthUserId3.token,
//           channelId: ChannelId3.channelId,
//         }
//       }
//     );
//     const data = JSON.parse(res.getBody() as string);
//     expect(data).toStrictEqual({
//       name: 'Hermione Fan Club',
//       isPublic: true,
//       ownerMembers: [
//         {
//           uId: expect.any(Number),
//           email: 'hermione.granger@gmail.com',
//           nameFirst: 'Hermione',
//           nameLast: 'Granger',
//           handleStr: 'hermionegranger'
//         }
//       ],
//       allMembers: [
//         {
//           uId: expect.any(Number),
//           email: 'hermione.granger@gmail.com',
//           nameFirst: 'Hermione',
//           nameLast: 'Granger',
//           handleStr: 'hermionegranger',
//         }
//       ],
//     });
//   });
// });

// /// ///// channelJoinV1 ////////
// describe('channelJoinV1(authUserId, channelId): Invalid Inputs', () => {
//   let AuthUserId1: { token: string, authUserId: number };
//   let AuthUserId2: { token: string, authUserId: number };
//   let AuthUserId3: { token: string, authUserId: number };
//   let ChannelId1: { channelId: number };
//   let ChannelId3: { channelId: number };
//   beforeEach(() => {
//     request('DELETE', SERVER_URL + '/clear/v1', { json: {} });
//     const res1 = request(
//       'POST',
//       SERVER_URL + '/auth/register/v2',
//       {
//         json: {
//           email: 'harry.potter@gmail.com',
//           password: 'quidditch',
//           nameFirst: 'Harry',
//           nameLast: 'Potter'
//         }
//       }
//     );
//     AuthUserId1 = JSON.parse(res1.getBody() as string);

//     const res2 = request(
//       'POST',
//       SERVER_URL + '/auth/register/v2',
//       {
//         json: {
//           email: 'ron.weasley@gmail.com',
//           password: 'flying car',
//           nameFirst: 'Ron',
//           nameLast: 'Weasley'
//         }
//       }
//     );
//     AuthUserId2 = JSON.parse(res2.getBody() as string);

//     const res3 = request(
//       'POST',
//       SERVER_URL + '/auth/register/v2',
//       {
//         json: {
//           email: 'hermione.granger@gmail.com',
//           password: 'reading',
//           nameFirst: 'Hermione',
//           nameLast: 'Granger'
//         }
//       }
//     );
//     AuthUserId3 = JSON.parse(res3.getBody() as string);

//     const res4 = request(
//       'POST',
//       SERVER_URL + '/channels/create/v2',
//       {
//         json: {
//           token: AuthUserId1.token,
//           name: 'Quidditch League',
//           isPublic: true,
//         }
//       }
//     );
//     ChannelId1 = JSON.parse(res4.getBody() as string);

//     const res6 = request(
//       'POST',
//       SERVER_URL + '/channels/create/v2',
//       {
//         json: {
//           token: AuthUserId3.token,
//           name: 'Hermione Fan Club',
//           isPublic: true,
//         }
//       }
//     );
//     ChannelId3 = JSON.parse(res6.getBody() as string);
//   });
//   /// /////////////////////////////////////////////////////
//   /// /////////////////////////////////////////////////////
//   /// /////////////////////////////////////////////////////

//   test('Missing token', () => {
//     const res = request(
//       'POST',
//       SERVER_URL + '/channel/join/v2',
//       {
//         json: {
//           token: undefined,
//           channelId: ChannelId1.channelId,
//         }
//       }
//     );
//     const data = JSON.parse(res.getBody() as string);
//     expect(data).toStrictEqual(ERROR);
//   });

//   test('Missing ChannelId1', () => {
//     const res = request(
//       'POST',
//       SERVER_URL + '/channel/join/v2',
//       {
//         json: {
//           token: AuthUserId1.token,
//           channelId: undefined,
//         }
//       }
//     );
//     const data = JSON.parse(res.getBody() as string);
//     expect(data).toStrictEqual(ERROR);
//   });

//   test('Invalid Token (not in storeData)', () => {
//     const res = request(
//       'POST',
//       SERVER_URL + '/channel/join/v2',
//       {
//         json: {
//           token: 111,
//           channelId: ChannelId1.channelId,
//         }
//       }
//     );
//     const data = JSON.parse(res.getBody() as string);
//     expect(data).toStrictEqual(ERROR);
//   });

//   test('Invalid ChannelId (not in storeData)', () => {
//     const res = request(
//       'POST',
//       SERVER_URL + '/channel/join/v2',
//       {
//         json: {
//           token: AuthUserId1.token,
//           channelId: 1010,
//         }
//       }
//     );
//     const data = JSON.parse(res.getBody() as string);
//     expect(data).toStrictEqual(ERROR);
//   });

//   test('test successsful 1', () => {
//     const res = request(
//       'POST',
//       SERVER_URL + '/channel/join/v2',
//       {
//         json: {
//           token: AuthUserId2.token,
//           channelId: ChannelId3.channelId,
//         }
//       }
//     );
//     const data = JSON.parse(res.getBody() as string);
//     expect(data).toStrictEqual({});
//   });

//   test('test successsful 2', () => {
//     const res = request(
//       'POST',
//       SERVER_URL + '/channel/join/v2',
//       {
//         json: {
//           token: AuthUserId3.token,
//           channelId: ChannelId1.channelId,
//         }
//       }
//     );
//     const data = JSON.parse(res.getBody() as string);
//     expect(data).toStrictEqual({});
//   });
// });
