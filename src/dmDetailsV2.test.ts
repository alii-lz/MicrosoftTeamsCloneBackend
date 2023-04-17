import { requestDmCreate, requestDmDetails } from './dmRequesters';
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

describe('/dm/details/v2 failure tests', () => {
  beforeEach(() => {
    requestClear();
    // Initalize AuthUserIds
    const AuthUserId1_return = requestAuthRegister('harry.potter@gmail.com', 'quidditch', 'Harry', 'Potter');
    AuthUserId1 = AuthUserId1_return.returnObj;
    const AuthUserId2_return = requestAuthRegister('ron.weasley@gmail.com', 'flying car', 'Ron', 'Weasley');
    AuthUserId2 = AuthUserId2_return.returnObj;
    const AuthUserId3_return = requestAuthRegister('hermione.granger@gmail.com', 'reading', 'Hermione', 'Granger');
    AuthUserId3 = AuthUserId3_return.returnObj;

    // Initalize dms
    const dm1_return = requestDmCreate(AuthUserId1.token, [AuthUserId2.authUserId]);
    dm1 = dm1_return.returnObj;
    const dm2_return = requestDmCreate(AuthUserId3.token, [AuthUserId2.authUserId]);
    dm2 = dm2_return.returnObj;
  });

  test('Test 1: Undefined token', () => {
    try {
      const result = requestDmDetails('', dm1.dmId);
      expect(result.returnObj.error).toEqual({ error: expect.any(String) });
      expect(result.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Test 2: Undefined dmId', () => {
    try {
      const result = requestDmDetails(AuthUserId1.token, null);
      expect(result.returnObj.error).toEqual({ error: expect.any(String) });
      expect(result.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Test 3: Invalid token', () => {
    try {
      const result = requestDmDetails('asdf', dm1.dmId);
      expect(result.returnObj.error).toEqual({ error: expect.any(String) });
      expect(result.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Test 4: Invalid dmId', () => {
    try {
      const result = requestDmDetails(AuthUserId1.token, 123123123123123);
      expect(result.returnObj.error).toEqual({ error: expect.any(String) });
      expect(result.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Test 5: valid dmId, but not authorised user (token)', () => {
    try {
      const result = requestDmDetails(AuthUserId1.token, dm2.dmId);
      expect(result.returnObj.error).toEqual({ error: expect.any(String) });
      expect(result.status).toBe(AUTHORIZATION_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});

describe('/dm/details/v2 success tests', () => {
  beforeEach(() => {
    requestClear();
    // Initalize AuthUserIds
    const AuthUserId1_return = requestAuthRegister('harry.potter@gmail.com', 'quidditch', 'Harry', 'Potter');
    AuthUserId1 = AuthUserId1_return.returnObj;
    const AuthUserId2_return = requestAuthRegister('ron.weasley@gmail.com', 'flying car', 'Ron', 'Weasley');
    AuthUserId2 = AuthUserId2_return.returnObj;
    const AuthUserId3_return = requestAuthRegister('hermione.granger@gmail.com', 'reading', 'Hermione', 'Granger');
    AuthUserId3 = AuthUserId3_return.returnObj;

    // Initalize dms
    const dm1_return = requestDmCreate(AuthUserId1.token, [AuthUserId2.authUserId]);
    dm1 = dm1_return.returnObj;
    const dm2_return = requestDmCreate(AuthUserId3.token, [AuthUserId2.authUserId]);
    dm2 = dm2_return.returnObj;
  });

  test('Test 1: Success', () => {
    const result = requestDmDetails(AuthUserId1.token, dm1.dmId);
    expect(result.returnObj).toStrictEqual({
      name: expect.any(String),
      members: expect.any(Array<string>)
    });
    expect(result.status).toBe(OK);
  });

  test('Test 2: Success', () => {
    const result = requestDmDetails(AuthUserId2.token, dm2.dmId);
    expect(result.returnObj).toStrictEqual({
      name: expect.any(String),
      members: expect.any(Array<string>)
    });
    expect(result.status).toBe(OK);
  });
});
