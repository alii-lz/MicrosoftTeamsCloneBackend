import { authLoginV1 } from './auth';
import { authRegisterV1 } from './auth';
import { ClearV1 } from './other';

// Tests for AuthLoginV1
test('Test Case 1: Successful Login ', () => {
  ClearV1();
  const registeredUser = authRegisterV1('rudie@gmail.com', 'soccer7', 'rudie', 'tate');
  const loginUser = authLoginV1('rudie@gmail.com', 'soccer7');

  expect(registeredUser).toStrictEqual(loginUser);
});

test('Test Case 2: Unsuccessful Login : Invalid Email ', () => {
  ClearV1();
  authRegisterV1('rudie@gmail.com', 'soccer7', 'rudie', 'tate');
  const loginUser = authLoginV1('rudie07@gmail.com', 'soccer7');

  expect(loginUser).toHaveProperty('error');
});

test('Test Case 3: Unsuccessful Login : Invalid Password ', () => {
  ClearV1();
  authRegisterV1('rudie@gmail.com', 'soccer7', 'rudie', 'tate');
  const loginUser = authLoginV1('rudie@gmail.com', 'Soccer7');

  expect(loginUser).toHaveProperty('error');
});

// Tests for AuthRegisterV1

test('Test Case 1: Correct registration: Success', () => {
  ClearV1();
  const result = authRegisterV1('rudie@gmail.com', 'soccer7', 'Rudie', 'Tate');
  const userId = result.authUserId;
  expect(userId).toEqual(expect.any(Number));
});

test('Test Case 2: Registered email being used: Error', () => {
  ClearV1();
  authRegisterV1('rudie@gmail.com', 'soccer7', 'Rudie', 'Tate');
  const result = authRegisterV1('rudie@gmail.com', 'soccer', 'Rudie', 'Maria');

  expect(result).toHaveProperty('error');
});

test('Test Case 3: Invalid email: Error', () => {
  ClearV1();
  const result = authRegisterV1('rudie.com', 'soccer7', 'Rudie', 'Tate');

  expect(result).toHaveProperty('error');
});

test('Test Case 4: Invalid length of last name: Error', () => {
  ClearV1();
  const result = authRegisterV1('rudie@gmail.com', 'soccer7', 'Rudie', '');

  expect(result).toHaveProperty('error');
});

test('Test Case 5: Invalid length of first name: Error', () => {
  ClearV1();
  const result = authRegisterV1('rudie@gmail.com', 'soccer7', '', 'Tate');

  expect(result).toHaveProperty('error');
});

test('Test Case 6: Short password: Error', () => {
  ClearV1();
  const result = authRegisterV1('rudiea@gmail.com', 'soc', 'Rudie', 'Tate');

  expect(result).toHaveProperty('error');
});
