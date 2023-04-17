import { requestAuthRegister, requestAuthLogin, requestAuthLogout, requestAuthPasswordResetRequest } from './authRequesters';
import { requestClear } from './clearRequester';
const OK = 200;
const INPUT_ERROR = 400;
const AUTHORIZATION_ERROR = 403;

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
    requestAuthRegister('tanish3@gmail.com', 'basketball', 'Tanish', 'Tate');
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
    try {
      const result = requestAuthRegister('rudie', 'soccer', 'Rudie', 'Tate');
      expect(result.returnObj.error).toEqual({ error: expect.any(String) });
      expect(result.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Test 2: Unsuccessful registration/ already registered email', () => {
    try {
      requestAuthRegister('rudie@gmail.com', 'soccer', 'Rudie', 'Tate');
      const result = requestAuthRegister('rudie@gmail.com', 'soccer', 'Rudie', 'Tate');
      expect(result.returnObj.error).toStrictEqual({ error: expect.any(String) });
      expect(result.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Test 3 : Unsuccessful registration/ short password', () => {
    try {
      const result = requestAuthRegister('rudie@gmail.com', 'meh', 'Rudie', 'Tate');
      expect(result.returnObj.error).toStrictEqual({ error: expect.any(String) });
      expect(result.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Test 4: Unsuccessful registration/ empty firstName', () => {
    try {
      const result = requestAuthRegister('rudie@gmail.com', 'soccer', '', 'Tate');
      expect(result.returnObj.error).toStrictEqual({ error: expect.any(String) });
      expect(result.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Test 5: Unsuccessful registration/ empty lastName', () => {
    try {
      const result = requestAuthRegister('rudie@gmail.com', 'soccer', 'Rudie', '');
      expect(result.returnObj.error).toStrictEqual({ error: expect.any(String) });
      expect(result.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Test 6: Unsuccessful registration/ firstName bigger than 50 characters', () => {
    try {
      const result = requestAuthRegister('rudie@gmail.com', 'soccer', 'r'.repeat(51), 'Tate');
      expect(result.returnObj.error).toStrictEqual({ error: expect.any(String) });
      expect(result.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Test 7: Unsuccessful registration/ lastName longer than 50 characters', () => {
    try {
      const result = requestAuthRegister('rudie@gmail.com', 'soccer', 'Rudie', 'T'.repeat(59));
      expect(result.returnObj.error).toStrictEqual({ error: expect.any(String) });
      expect(result.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});

describe('auth/Login/V2 success tests', () => {
  let registration: any;
  beforeEach(() => {
    requestClear();
    registration = requestAuthRegister('rudie@gmail.com', 'soccer', 'Rudie', 'Tate');
  });

  test('Test 1: Successful login/ return values/ testing returned object', () => {
    const loginResult = requestAuthLogin('rudie@gmail.com', 'soccer');
    expect(loginResult.returnObj).toStrictEqual({ token: (expect.any(String)), authUserId: (expect.any(Number)) });
    expect(loginResult.status).toBe(OK);
  });

  test('Test 2: Successful login/ after successful registration/ matching authUserIds returned', () => {
    const loginResult = requestAuthLogin('rudie@gmail.com', 'soccer');
    expect(loginResult.returnObj.authUserId).toStrictEqual(registration.returnObj.authUserId);
    expect(loginResult.status).toBe(OK);
  });

  test('Test 3: Correct return values despite two users with the same names', () => {
    requestAuthRegister('rudie1@gmail.com', 'football', 'Rudie', 'Tate');
    const loginResult = requestAuthLogin('rudie@gmail.com', 'soccer');
    expect(loginResult.returnObj.authUserId).toStrictEqual(registration.returnObj.authUserId);
    expect(loginResult.status).toBe(OK);
  });

  test('Test 4: Correct return values despite two users with the same password', () => {
    requestAuthRegister('Tanish@gmail.com', 'soccer', 'Tanish', 'Tate');
    const loginResult = requestAuthLogin('rudie@gmail.com', 'soccer');
    expect(loginResult.returnObj.authUserId).toStrictEqual(registration.returnObj.authUserId);
    expect(loginResult.status).toBe(OK);
  });

  test('Test 5: Token generation after successive login and logout', () => {
    const loginResult1 = requestAuthLogin('rudie@gmail.com', 'soccer');
    requestAuthLogout(loginResult1.returnObj.token);
    const loginResult2 = requestAuthLogin('rudie@gmail.com', 'soccer');
    expect(loginResult2.returnObj).toStrictEqual({ token: expect.any(String), authUserId: expect.any(Number) });
    expect(loginResult1.returnObj).not.toBe(loginResult2.returnObj);
    expect(loginResult2.status).toBe(OK);
  });
  test('Test 6: Login after user is loged out', () => {
    const loginResult1 = requestAuthLogin('rudie@gmail.com', 'soccer');
    requestAuthLogout(loginResult1.returnObj.token);
    const loginResult2 = requestAuthLogin('rudie@gmail.com', 'soccer');
    expect(loginResult2.returnObj).toStrictEqual({ token: expect.any(String), authUserId: expect.any(Number) });
    expect(loginResult2.status).toBe(OK);
  });
});

describe(' auth/Login/V2 failure tests', () => {
  beforeEach(() => {
    requestClear();
    requestAuthRegister('rudie@gmail.com', 'soccer', 'rudie', 'Mathew');
  });

  test('Test 1: Unsuccessful login/ incorrect email', () => {
    try {
      const loginResult = requestAuthLogin('rudieee@gmail.com', 'soccer');
      expect(loginResult.returnObj.error).toStrictEqual({ error: expect.any(String) });
      expect(loginResult.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Test 2: Unsuccessful login/ incorrect password', () => {
    try {
      const loginResult = requestAuthLogin('rudie@gmail.com', 'soccerrr');
      expect(loginResult.returnObj.error).toStrictEqual({ error: expect.any(String) });
      expect(loginResult.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Test 3: Unsuccessful login/ empty datastore', () => {
    try {
      requestClear();
      const loginResult = requestAuthLogin('rudie@gmail.com', 'soccerrr');
      expect(loginResult.returnObj.error).toStrictEqual({ error: expect.any(String) });
      expect(loginResult.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});

describe(' auth/Logout/V1 success tests', () => {
  test('Test : Successful logout', () => {
    requestClear();
    const register = requestAuthRegister('rudie@gmail.com', 'soccer', 'Rudie', 'Tate');

    const logout = requestAuthLogout(register.returnObj.token);

    expect(logout.returnObj).toStrictEqual({});
    expect(logout.status).toBe(OK);
  });
});

describe(' auth/Logout/V1 faiure tests', () => {
  let register: any;
  beforeEach(() => {
    requestClear();
    register = requestAuthRegister('rudie@gmail.com', 'soccer', 'Rudie', 'Tate');
  });

  test('Test 1: logout failed / already logged out token ', () => {
    try {
      requestAuthLogout(register.returnObj.token);
      const logout = requestAuthLogout(register.returnObj.token);
      expect(logout.returnObj.error).toStrictEqual({ error: expect.any(String) });
      expect(logout.status).toBe(AUTHORIZATION_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Test 2: logout failed / invalid token', () => {
    try {
      const logout = requestAuthLogout(register.returnObj.token + 'a');

      expect(logout.returnObj.error).toStrictEqual({ error: expect.any(String) });
      expect(logout.status).toBe(AUTHORIZATION_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});

describe(' auth/passwordreset/request/V1 tests', () => {
  let register: any;
  beforeEach(() => {
    requestClear();
    register = requestAuthRegister('rudie@gmail.com', 'soccer', 'Rudie', 'Tate').returnObj;
  });

  test('Test 1: Request failed / not a registered email/ testing that all active user sessions are still active using logout ', () => {
    // only active user session is the one from registration
    const activeToken = register.token;
    const request = requestAuthPasswordResetRequest('arden@gmail.com');
    expect(requestAuthLogout(activeToken).status).toStrictEqual(OK);
    expect(request.returnObj).toStrictEqual({ });
    expect(request.status).toBe(OK);
  });

  test('Test 2: request successful / testing that all of the user"s sessions have been logged out', () => {
    try {
      const login = requestAuthLogin('rudie@gmail.com', 'soccer').returnObj;
      const request = requestAuthPasswordResetRequest('rudie@gmail.com');
      const logout = requestAuthLogout(login.token).returnObj;
      const logout2 = requestAuthLogout(register.token).returnObj;
      expect(logout.returnObj).toStrictEqual({ error: expect.any(String) });
      expect(logout2.returnObj).toStrictEqual({ error: expect.any(String) });

      expect(request.returnObj).toStrictEqual({});
      expect(request.status).toStrictEqual(OK);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Test 3: request successful / testing that only the correct user sessions have been logged out', () => {
    try {
      const register2 = requestAuthRegister('danny@gmail.com', 'soccer', 'danny', 'chan').returnObj;
      const request = requestAuthPasswordResetRequest('rudie@gmail.com');
      const logout = requestAuthLogout(register.token).returnObj;
      const logout2 = requestAuthLogout(register2.token).returnObj;
      expect(logout.status).toStrictEqual(AUTHORIZATION_ERROR);
      expect(logout2.status).toStrictEqual(OK);

      expect(request.returnObj).toStrictEqual({});
      expect(request.status).toStrictEqual(OK);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});
