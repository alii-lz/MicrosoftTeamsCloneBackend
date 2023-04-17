import { requestSendlaterV1 } from './sendlaterRequestor.test'; 
import { requestChannelsCreateV3 } from './channels.test';
// import { requestDmCreate } from './dmRequesters';
import { requestAuthRegister } from './authRequesters';
import { requestClear } from './clearRequester';

const OK = 200;
const INPUT_ERROR = 400;
const AUTHORIZATION_ERROR = 403;

let AuthUserId1: { token: string, authUserId: number };
let AuthUserId2: { token: string, authUserId: number };

// let dm1: { dmId: number };
// let dm2: { dmId: number };

let channelId1: { channelId: number };
let channelId2: { channelId: number };

describe('/message/sendlater/v1 failure tests', () => {
  beforeEach(() => {
    requestClear();
    // Initalize AuthUserIds
    const AuthUserId1_return = requestAuthRegister('harry.potter@gmail.com', 'quidditch', 'Harry', 'Potter');
    AuthUserId1 = AuthUserId1_return.returnObj;
    const AuthUserId2_return = requestAuthRegister('ron.weasley@gmail.com', 'flying car', 'Ron', 'Weasley');
    AuthUserId2 = AuthUserId2_return.returnObj;

    // Initalize channelId 
    const channelId1_return = requestChannelsCreateV3(AuthUserId1.token, 'Quidditch League', true);
    channelId1 = channelId1_return.returnObj;
    const channelId2_return = requestChannelsCreateV3(AuthUserId2.token, 'Hermione Fan Club', true);
    channelId2 = channelId2_return.returnObj;
  });

  test('Test 1: Undefined token', () => {
    try {
      const result = requestSendlaterV1(undefined, channelId1.channelId, 'Hello', 1);
      expect(result.returnObj.error).toEqual({ error: expect.any(String) });
      expect(result.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Test 2: Undefined channelId', () => {
    try {
      const result = requestSendlaterV1(AuthUserId1.token, undefined, 'Hello', 1);
      expect(result.returnObj.error).toEqual({ error: expect.any(String) });
      expect(result.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Test 3: Undefined message', () => {
    try {
      const result = requestSendlaterV1(AuthUserId1.token, channelId1.channelId, undefined, 1);
      expect(result.returnObj.error).toEqual({ error: expect.any(String) });
      expect(result.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Test 4: Undefined timeSent', () => {
    try {
      const result = requestSendlaterV1(AuthUserId1.token, channelId1.channelId, 'Hello', undefined);
      expect(result.returnObj.error).toEqual({ error: expect.any(String) });
      expect(result.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Test 5: invalid token', () => {
    try {
      const result = requestSendlaterV1('-1', channelId1.channelId, 'Hello', 1);
      expect(result.returnObj.error).toEqual({ error: expect.any(String) });
      expect(result.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Test 6: invalid channelId', () => {
    try {
      const result = requestSendlaterV1(AuthUserId1.token, -1, 'Hello', 1);
      expect(result.returnObj.error).toEqual({ error: expect.any(String) });
      expect(result.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Test 7: invalid message', () => {
    try {
      const result = requestSendlaterV1(AuthUserId1.token, channelId1.channelId, '', 1);
      expect(result.returnObj.error).toEqual({ error: expect.any(String) });
      expect(result.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Test 8: invalid timeSent, in the past', () => {
    try {
      const result = requestSendlaterV1(AuthUserId1.token, channelId1.channelId, 'Hello', -1);
      expect(result.returnObj.error).toEqual({ error: expect.any(String) });
      expect(result.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Test 9: token is not part of channel', () => {
    try {
      const result = requestSendlaterV1(AuthUserId2.token, channelId1.channelId, 'Hello', 1);
      expect(result.returnObj.error).toEqual({ error: expect.any(String) });
      expect(result.status).toBe(AUTHORIZATION_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});

describe('/message/sendlater/v1 success tests', () => {
  beforeEach(() => {
    requestClear();
    // Initalize AuthUserIds
    const AuthUserId1_return = requestAuthRegister('harry.potter@gmail.com', 'quidditch', 'Harry', 'Potter');
    AuthUserId1 = AuthUserId1_return.returnObj;
    const AuthUserId2_return = requestAuthRegister('ron.weasley@gmail.com', 'flying car', 'Ron', 'Weasley');
    AuthUserId2 = AuthUserId2_return.returnObj;

    // Initalize channelId 
    const channelId1_return = requestChannelsCreateV3(AuthUserId1.token, 'Quidditch League', true);
    channelId1 = channelId1_return.returnObj;
    const channelId2_return = requestChannelsCreateV3(AuthUserId2.token, 'Hermione Fan Club', true);
    channelId2 = channelId2_return.returnObj;
  });

  test.only('Test 1: Success', () => {
    const result = requestSendlaterV1(AuthUserId1.token, channelId1.channelId, 'Hello', 2);
    expect(result.returnObj).toStrictEqual({
      messageId: expect.any(Number)
    });
    expect(result.status).toBe(OK);
  });

  test('Test 2: Success', () => {
    const result = requestSendlaterV1(AuthUserId2.token, channelId2.channelId, 'Hello', 2);
    expect(result.returnObj).toStrictEqual({
      messageId: expect.any(Number)
    });
    expect(result.status).toBe(OK);
  });
});
