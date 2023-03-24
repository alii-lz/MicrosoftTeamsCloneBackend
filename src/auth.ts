import { getData } from './dataStore';
import { setData } from './dataStore';
import validator from 'validator';

import { error, authUserId } from './interfaces';

function authRegisterV1(email: string, password: string, nameFirst: string, nameLast: string): error | authUserId {
  const invalidFirstName = (nameFirst.length < 1 || nameFirst.length > 50);

  const invalidLastName = (nameLast.length < 1 || nameLast.length > 50);

  const invalidPassword = (password.length < 6);

  const invalidEmail = (!validator.isEmail(email));

  if (invalidFirstName || invalidLastName || invalidPassword || invalidEmail) {
    return { error: 'One or more invalid inputs' };
  }

  const data = getData();
  const ifDataStoreEmpty = (data.users.length === 0);

  if (!ifDataStoreEmpty) {
    const registeredUser = data.users.find((user) => user.email === email);

    if (registeredUser) {
      return { error: 'Already registered' };
    }
  }

  const uId = data.users.length + 1;

  let handleStr = (nameFirst + nameLast).toLowerCase();
  handleStr = handleStr.replace(/\W/g, '');

  if (!ifDataStoreEmpty) {
    let existingHandle = data.users.find(user => user.handleStr.includes(handleStr));
    if (existingHandle) {
      existingHandle = existingHandle.handleStr;

      const endCharacter = existingHandle?.slice(-1);

      existingHandle = endCharacter && !isNaN(parseInt(endCharacter))
        ? existingHandle.replace(/.$/, parseInt(endCharacter) + 1)
        : `${existingHandle || ''}0`;
      handleStr = existingHandle;
    }
  }

  const newUser = {
    uId: uId,
    email: email,
    password: password,
    nameFirst: nameFirst,
    nameLast: nameLast,
    handleStr: handleStr,
  };

  data.users.push(newUser);

  setData(data);
  return { authUserId: uId };
}

function authLoginV1(email: string, password: string): error | authUserId {
  const data = getData();
  if (data.users.length === 0) {
    return {
      error: 'Email not found',
    };
  }
  const user = data.users.find(user => user.email === email);
  if (!user) {
    return {
      error: 'Email not found',
    };
  }

  if (user.password !== password) {
    return {
      error: 'Invalid password',
    };
  }
  return {
    authUserId: user.uId,
  };
}
export { authRegisterV1, authLoginV1 };
