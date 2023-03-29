import { requestAuthLogout, requestAuthRegister } from './authRequesters';
import { requestClear } from './clearRequester';
const OK = 200;

describe('auth/authregisterV2 success tests', () => {
  beforeEach(() => {
    requestClear();
  });
  test('Test 1: Successful registration/should return token and authUserID', () => {
    const result = requestAuthRegister('rudie@gmail.com', 'soccer', 'Rudie', 'Tate');
    expect(result.returnObj).toStrictEqual({ token: (expect.any(String)), authUserId: (expect.any(Number)) });
    expect(result.status).toBe(OK);
  });

  test('Test 2: Successful registration/ Multiple users with same name but different mail addresses and passwords', () => {
    requestAuthRegister('tanish@gmail.com', 'football', 'Tanish', 'Tate');
    const result = requestAuthRegister('rudie@gmail.com', 'soccer', 'Tanish', 'Tate');
    expect(result.returnObj).toStrictEqual({ token: (expect.any(String)), authUserId: (expect.any(Number)) });
    expect(result.status).toBe(OK);
  });

  test('Test 3: Successful registration/ Multiple users have the same password but different email ids and names', () => {
    requestAuthRegister('Tanish@gmail.com', 'soccer', 'Tanish', 'Tate');
    const result = requestAuthRegister('rudie@gmail.com', 'soccer', 'Rudie', 'Tate');
    expect(result.returnObj).toStrictEqual({ token: (expect.any(String)), authUserId: (expect.any(Number)) });
    expect(result.status).toBe(OK);
  });

  test('Test 4: Successful registration/Multiple users have the same passwords and names but different email ids', () => {
    requestAuthRegister('Tanish@gmail.com', 'soccer', 'Rudie', 'Tate');
    const result = requestAuthRegister('rudie@gmail.com', 'soccer', 'Rudie', 'Tate');
    expect(result.returnObj).toStrictEqual({ token: (expect.any(String)), authUserId: (expect.any(Number)) });
    expect(result.status).toBe(OK);
  });
});

describe('auth/regiter/V2 failure tests', () => {
  beforeEach(() => {
    requestClear();
  });
  test('Test 1: Unsuccessful registration/ invalid email/ should return error ', () => {
    const result = requestAuthRegister('rudie', 'soccer', 'Rudie', 'Tate');
    expect(result.returnObj).toEqual({ error: expect.any(String) });
    expect(result.status).toBe(OK);
  });

  test('Test 2: Unsuccessful registration/ already registered email', () => {
    requestAuthRegister('rudie@gmail.com', 'soccer', 'Rudie', 'Tate');
    const result = requestAuthRegister('rudie@gmail.com', 'soccer', 'Rudie', 'Tate');
    expect(result.returnObj).toStrictEqual({ error: expect.any(String) });
    expect(result.status).toBe(OK);
  });

  test('Test 3 : Unsuccessful registration/ short password', () => {
    const result = requestAuthRegister('rudie@gmail.com', 'meh', 'Rudie', 'Tate');
    expect(result.returnObj).toStrictEqual({ error: expect.any(String) });
    expect(result.status).toBe(OK);
  });

  test('Test 4: Unsuccessful registration/ empty firstName', () => {
    const result = requestAuthRegister('rudie@gmail.com', 'soccer', '', 'Tate');
    expect(result.returnObj).toStrictEqual({ error: expect.any(String) });
    expect(result.status).toBe(OK);
  });

  test('Test 5: Unsuccessful registration/ empty lastName', () => {
    const result = requestAuthRegister('rudie@gmail.com', 'soccer', 'Rudie', '');
    expect(result.returnObj).toStrictEqual({ error: expect.any(String) });
    expect(result.status).toBe(OK);
  });

  test('Test 6: Unsuccessful registration/ firstName bigger than 50 characters', () => {
    const result = requestAuthRegister('rudie@gmail.com', 'soccer', 'r'.repeat(51), 'Tate');
    expect(result.returnObj).toStrictEqual({ error: expect.any(String) });
    expect(result.status).toBe(OK);
  });

  test('Test 7: Unsuccessful registration/ lastName longer than 50 characters', () => {
    const result = requestAuthRegister('rudie@gmail.com', 'soccer', 'Rudie', 'T'.repeat(50));
    expect(result.returnObj).toStrictEqual({ error: expect.any(String) });
    expect(result.status).toBe(OK);
  });

  test('Test 8: Unsuccessful registration/ existing logged out user trying to register', () => {
    const registerResult1 = requestAuthRegister('rudie@gmail.com', 'soccer', 'Rudie', 'Tate');
    requestAuthLogout(registerResult1.returnObj.token);
    const registerResult2 = requestAuthRegister('rudie@gmail.com', 'soccer', 'Rudie', 'Tate');
    expect(registerResult2.returnObj).toStrictEqual({ error: expect.any(String) });
    expect(registerResult2.status).toBe(OK);
  });
});
