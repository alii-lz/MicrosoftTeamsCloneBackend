import { requestSethandleStrV2 } from './profileRequesters';
import { requestAuthRegister } from './authRequesters';
import { requestClear } from './clearRequester';
const OK = 200;
const INPUT_ERROR = 400;

let AuthUserId1: { token: string, authUserId: number };
let AuthUserId2: { token: string, authUserId: number };

describe('user/profile/sethandle/v2 failure testCases', () => {
  beforeEach(() => {
    requestClear();
    // Initalize AuthUserIds
    const AuthUserId1_return = requestAuthRegister('harry.potter@gmail.com', 'quidditch', 'Harry', 'Potter');
    AuthUserId1 = AuthUserId1_return.returnObj;
    const AuthUserId2_return = requestAuthRegister('ron.weasley@gmail.com', 'flying car', 'Ron', 'Weasley');
    AuthUserId2 = AuthUserId2_return.returnObj;
  });

  test('Test 1: Undefined token', () => {
    try {
      const result = requestSethandleStrV2(undefined, 'harrypotter1');
      expect(result.returnObj.error).toEqual({ error: expect.any(String) });
      expect(result.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Test 2: undefined handlestr', () => {
    try {
      const result = requestSethandleStrV2(AuthUserId1.token, undefined);
      expect(result.returnObj.error).toEqual({ error: expect.any(String) });
      expect(result.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Test 3: < 3 characters', () => {
    try {
      const result = requestSethandleStrV2(AuthUserId1.token, 'ha');
      expect(result.returnObj.error).toEqual({ error: expect.any(String) });
      expect(result.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Test 4: > 20 characters', () => {
    try {
      const result = requestSethandleStrV2(AuthUserId1.token, 'hadfajsojnfjdhsailfhjksahf');
      expect(result.returnObj.error).toEqual({ error: expect.any(String) });
      expect(result.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Test 5: not alphanumeric', () => {
    try {
      const result = requestSethandleStrV2(AuthUserId1.token, 'h@rrypotter!');
      expect(result.returnObj.error).toEqual({ error: expect.any(String) });
      expect(result.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Test 6: not lowercase', () => {
    try {
      const result = requestSethandleStrV2(AuthUserId1.token, 'NOTALLOWED');
      expect(result.returnObj.error).toEqual({ error: expect.any(String) });
      expect(result.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Test 7: handleStr is already taken', () => {
    try {
      const result = requestSethandleStrV2(AuthUserId1.token, 'ronweasley');
      expect(result.returnObj.error).toEqual({ error: expect.any(String) });
      expect(result.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});

describe('user/profile/sethandle/v2 success testCases', () => {
  beforeEach(() => {
    requestClear();
    const AuthUserId1_return = requestAuthRegister('harry.potter@gmail.com', 'quidditch', 'Harry', 'Potter');
    AuthUserId1 = AuthUserId1_return.returnObj;
    const AuthUserId2_return = requestAuthRegister('ron.weasley@gmail.com', 'flying car', 'Ron', 'Weasley');
    AuthUserId2 = AuthUserId2_return.returnObj;
  });

  test('Test 1: Success first-last name change', () => {
    const result = requestSethandleStrV2(AuthUserId1.token, 'harrypotter1');
    expect(result.returnObj).toStrictEqual({});
    expect(result.status).toBe(OK);
  });

  test('Test 2: Success first name change', () => {
    const result = requestSethandleStrV2(AuthUserId2.token, 'ronnieweasley');
    expect(result.returnObj).toStrictEqual({});
    expect(result.status).toBe(OK);
  });
});
