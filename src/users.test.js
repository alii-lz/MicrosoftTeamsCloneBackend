import { ClearV1 } from './other.js';
import { authRegisterV1 } from './auth.js';
import { userProfileV1 } from './users.js';

const ERROR = { error: expect.any(String) };

beforeEach(() => {
  ClearV1();
});

describe('All tests for userProfileV1', () => {
  test('Invalid authUserId', () => {
    const user = authRegisterV1('validemail@gmail.com', '123abc!@#', 'Jake', 'Renzella');

    const userToFind = authRegisterV1('ali@gmail.com', '123abc!@#', 'ali', 'ahmed');

    expect(userProfileV1(user.uId + 1, userToFind.uId)).toStrictEqual(ERROR);
  });

  test('Invalid uId', () => {
    const user = authRegisterV1('validemail@gmail.com', '123abc!@#', 'Jake', 'Renzella');

    const userToFind = authRegisterV1('ali@gmail.com', '123abc!@#', 'ali', 'ahmed');

    expect(userProfileV1(user.uId, userToFind.uId + 1)).toStrictEqual(ERROR);
  });

  test('Correct return type', () => {
    const user = authRegisterV1('validemail@gmail.com', '123abc!@#', 'Jake', 'Renzella');

    const userToFind = authRegisterV1('ali@gmail.com', '123abc!@#', 'ali', 'ahmed');

    expect(userProfileV1(user.authUserId, userToFind.authUserId)).toStrictEqual({

      user: {
        uId: userToFind.authUserId,
        email: 'ali@gmail.com',
        nameFirst: 'ali',
        nameLast: 'ahmed',
        handleStr: 'aliahmed',
      }
    });
  });
});
