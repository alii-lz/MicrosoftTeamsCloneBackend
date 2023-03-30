import { getData } from './dataStore';
import { setData } from './dataStore';
import validator from 'validator';
import { Data } from './interfaces';
import { getId } from './other';

function authRegisterV1(email: string, password: string, nameFirst: string, nameLast: string) {
  const invalidFirstName = (nameFirst.length < 1 || nameFirst.length > 50);

  const invalidLastName = (nameLast.length < 1 || nameLast.length > 50);

  const invalidPassword = (password.length < 6);

  const invalidEmail = (!validator.isEmail(email));

  if (invalidFirstName || invalidLastName || invalidPassword || invalidEmail) {
    return { error: 'One or more invalid inputs' };
  }

  const data: Data = getData();
  const ifDataStoreEmpty = (data.users.length === 0);
  let globalOwner = false;
  if (ifDataStoreEmpty) {
    globalOwner = true;
  }

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
    const existingHandle = data.users.find(user => user.handleStr.includes(handleStr));
    if (existingHandle) {
      handleStr = existingHandle.handleStr;

      const endCharacter = handleStr.slice(-1);

      handleStr = !isNaN(parseInt(endCharacter)) ? handleStr.replace(/.$/, (parseInt(endCharacter) + 1).toString()) : `${handleStr}0`;
    }
  }
  const newToken = (data.tokens.length + 1).toString();
  const newUser = {
    uId: uId,
    email: email,
    password: password,
    nameFirst: nameFirst,
    nameLast: nameLast,
    handleStr: handleStr,
    globalOwner: globalOwner,
    tokens: [newToken]
  };

  data.users.push(newUser);
  data.tokens.push({
    token: newToken,
    active: true
  });

  setData(data);
  return { authUserId: uId, token: newToken };
}

function authLoginV1(email: string, password: string) {
  const data: Data = getData();
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
  const newToken = (data.tokens.length + 1).toString();
  user.tokens.push(newToken);
  data.tokens.push({
    token: newToken,
    active: true
  });
  return {
    authUserId: user.uId,
    token: newToken
  };
}

function authLogoutV1(token: string){
 
  if (getId(token) === -1){
    return {
      error: 'invalid token'
    }
  }
  let data: Data = getData();
    const tokenFinder = data.tokens.findIndex((item) => item.token === token);
    data.tokens[tokenFinder].active = false;
    setData(data)
    return {};
    

}

export { authRegisterV1, authLoginV1, authLogoutV1 };
