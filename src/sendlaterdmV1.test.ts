import { requestSendlaterdmV1 } from './sendlaterRequestor.test';
import { requestDmCreate } from './dmRequesters';
import { requestAuthRegister } from './authRequesters';
import { requestClear } from './clearRequester';

const OK = 200;
const INPUT_ERROR = 400;
const AUTHORIZATION_ERROR = 403;

let AuthUserId1: { token: string, authUserId: number };
let AuthUserId2: { token: string, authUserId: number };
let AuthUserId3: { token: string, authUserId: number };

let dm1: { dmId: number };
let dm2: { dmId: number };

describe('/message/sendlater/v1 failure tests', () => {
  beforeEach(() => {
    requestClear();
    // Initalize AuthUserIds
    const AuthUserId1_return = requestAuthRegister('harry.potter@gmail.com', 'quidditch', 'Harry', 'Potter');
    AuthUserId1 = AuthUserId1_return.returnObj;
    const AuthUserId2_return = requestAuthRegister('ron.weasley@gmail.com', 'flying car', 'Ron', 'Weasley');
    AuthUserId2 = AuthUserId2_return.returnObj;
    const AuthUserId3_return = requestAuthRegister('hermione.granger@gmail.com', 'reading', 'Hermione', 'Granger');
    AuthUserId3 = AuthUserId3_return.returnObj;

    // Initalize channelId
    const dm1_return = requestDmCreate(AuthUserId1.token, [AuthUserId2.authUserId]);
    dm1 = dm1_return.returnObj;
    const dm2_return = requestDmCreate(AuthUserId3.token, [AuthUserId2.authUserId]);
    dm2 = dm2_return.returnObj;
  });

  test('Test 1: Undefined token', () => {
    try {
      const result = requestSendlaterdmV1(undefined, dm1.dmId, 'Hello', 1);
      expect(result.returnObj.error).toEqual({ error: expect.any(String) });
      expect(result.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Test 2: Undefined channelId', () => {
    try {
      const result = requestSendlaterdmV1(AuthUserId1.token, undefined, 'Hello', 1);
      expect(result.returnObj.error).toEqual({ error: expect.any(String) });
      expect(result.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Test 3: Undefined message', () => {
    try {
      const result = requestSendlaterdmV1(AuthUserId1.token, dm1.dmId, undefined, 1);
      expect(result.returnObj.error).toEqual({ error: expect.any(String) });
      expect(result.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Test 4: Undefined timeSent', () => {
    try {
      const result = requestSendlaterdmV1(AuthUserId1.token, dm1.dmId, 'Hello', undefined);
      expect(result.returnObj.error).toEqual({ error: expect.any(String) });
      expect(result.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Test 5: invalid token', () => {
    try {
      const result = requestSendlaterdmV1('-1', dm1.dmId, 'Hello', 1);
      expect(result.returnObj.error).toEqual({ error: expect.any(String) });
      expect(result.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Test 6: invalid channelId', () => {
    try {
      const result = requestSendlaterdmV1(AuthUserId1.token, -1, 'Hello', 1);
      expect(result.returnObj.error).toEqual({ error: expect.any(String) });
      expect(result.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Test 7: invalid message', () => {
    try {
      const result = requestSendlaterdmV1(AuthUserId1.token, dm1.dmId, '', 1);
      expect(result.returnObj.error).toEqual({ error: expect.any(String) });
      expect(result.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Test 8: invalid timeSent, in the past', () => {
    try {
      const result = requestSendlaterdmV1(AuthUserId1.token, dm1.dmId, 'Hello', -1);
      expect(result.returnObj.error).toEqual({ error: expect.any(String) });
      expect(result.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Test 9: token is not part of channel', () => {
    try {
      const result = requestSendlaterdmV1(AuthUserId2.token, dm1.dmId, 'Hello', 1);
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
    const AuthUserId3_return = requestAuthRegister('hermione.granger@gmail.com', 'reading', 'Hermione', 'Granger');
    AuthUserId3 = AuthUserId3_return.returnObj;

    // Initalize channelId
    const dm1_return = requestDmCreate(AuthUserId1.token, [AuthUserId2.authUserId]);
    dm1 = dm1_return.returnObj;
    const dm2_return = requestDmCreate(AuthUserId3.token, [AuthUserId2.authUserId]);
    dm2 = dm2_return.returnObj;
  });

  test.only('Test 1: Success', () => {
    const result = requestSendlaterdmV1(AuthUserId1.token, dm1.dmId, 'Hello', 2);
    expect(result.returnObj).toStrictEqual({
      messageId: expect.any(Number)
    });
    expect(result.status).toBe(OK);
  });

  test('Test 2: Success', () => {
    const result = requestSendlaterdmV1(AuthUserId2.token, dm2.dmId, 'Hello', 2);
    expect(result.returnObj).toStrictEqual({
      messageId: expect.any(Number)
    });
    expect(result.status).toBe(OK);
  });
});
