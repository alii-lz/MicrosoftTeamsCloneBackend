import request from 'sync-request';
import { port, url } from './config.json';
import { requestUserProfileUploadPhotoV3, requestUserProfileV3 } from './userRequestor';
const SERVER_URL = `${url}:${port}`;
const OK = 200;
const INPUT_ERROR = 400;
const AUTHORIZATION_ERROR = 403;
const ERROR = { error: expect.any(String) };

beforeEach(() => {
  request('DELETE', SERVER_URL + '/clear/v1', { json: {} });
});

export function requestAuthRegister(email: string, password: string, nameFirst: string, nameLast: string) {
  const res = request(
    'POST',
    SERVER_URL + '/auth/register/v3',
    {
      json: {
        email: email,
        password: password,
        nameFirst: nameFirst,
        nameLast: nameLast,
      },
      timeout: 100
    }
  );
  return { status: res.statusCode, returnObj: JSON.parse(res.body as string) };
}

describe('Tests for /user/profile/v3', () => {
  let user: {status: number, returnObj: {token: string, authUserId: number}};
  beforeEach(() => {
    user = requestAuthRegister('ali@gmail.com', 'football', 'ali', 'ahmed');
  });

  test('success case', () => {
    const result = requestUserProfileV3(user.returnObj.token, user.returnObj.authUserId);

    expect(result.status).toBe(OK);
    expect(result.returnObj).toStrictEqual({
      user: {
        uId: user.returnObj.authUserId,
        email: 'ali@gmail.com',
        nameFirst: 'ali',
        nameLast: 'ahmed',
        handleStr: 'aliahmed'
      }
    });
  });

  test('uId does not refer to a valid user', () => {
    try {
      const result = requestUserProfileV3(user.returnObj.token, user.returnObj.authUserId + 1);
      expect(result.returnObj.error).toEqual({ error: expect.any(String) });
      expect(result.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('invalid token', () => {
    try {
      const result = requestUserProfileV3(user.returnObj.token + 'a', user.returnObj.authUserId);
      expect(result.returnObj.error).toEqual({ error: expect.any(String) });
      expect(result.status).toBe(AUTHORIZATION_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});

describe('Tests for /user/profile/uploadphoto/v1', () => {
  let user: {status: number, returnObj: {token: string, authUserId: number}};
  beforeEach(() => {
    user = requestAuthRegister('ali@gmail.com', 'football', 'ali', 'ahmed');
  });

  // test('success case', () => {

  // });

  test('not a jpg', () => {
    try {
      const result = requestUserProfileUploadPhotoV3(user.returnObj.token,
        ' http://localhost:5001/imgurl/adfnajnerkn23k4234.pdf', 0, 0, 10, 10);

      expect(result.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('invalid token', () => {
    try {
      const result = requestUserProfileUploadPhotoV3(user.returnObj.token + 'a',
        'http://localhost:5001/imgurl/adfnajnerkn23k4234.jpg', 0, 0, 10, 10);

      expect(result.status).toBe(AUTHORIZATION_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('invalid dimension -- xEnd <= xStart', () => {
    try {
      const result = requestUserProfileUploadPhotoV3(user.returnObj.token,
        'http://localhost:5001/imgurl/adfnajnerkn23k4234.jpg', 0, 0, -1, 10);

      expect(result.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('invalid dimension -- yEnd <= yStart', () => {
    try {
      const result = requestUserProfileUploadPhotoV3(user.returnObj.token,
        'http://localhost:5001/imgurl/adfnajnerkn23k4234.jpg', 0, 0, 10, -1);

      expect(result.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});
