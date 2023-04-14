import { getData } from './dataStore';
import { setData } from './dataStore';
import validator from 'validator';
import { Data } from './interfaces';
import { getId } from './other';
import HTTPError from 'http-errors';
const passwordHash = require('password-hash');
const UIDGenerator = require('uid-generator')
const tokenGenerator = new UIDGenerator(32,UIDGenerator.BASE16);

function authRegisterV1(email: string, password: string, nameFirst: string, nameLast: string) {
  const invalidFirstName = (nameFirst.length < 1 || nameFirst.length > 50);

  const invalidLastName = (nameLast.length < 1 || nameLast.length > 50);

  const invalidPassword = (password.length < 6);

  const invalidEmail = (!validator.isEmail(email));

  if (invalidFirstName || invalidLastName || invalidPassword || invalidEmail) {
    throw HTTPError(400, 'Bad request');
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
  
  const newToken = tokenGenerator.generateSync();
  const newUser = {
    uId: uId,
    email: email,
    password: passwordHash.generate(password),
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
    
      throw HTTPError(400, 'Bad request');
    
  }
  const user = data.users.find(user => user.email === email);
  if (!user) {
    
      throw HTTPError(400, 'Bad request');
    
  }

  if (!passwordHash.verify(password, user.password)) {
   
    throw HTTPError(400, 'Bad request');
    
  }
  const newToken = tokenGenerator.generateSync();
  user.tokens.push(newToken);
  data.tokens.push({
    token: newToken,
    active: true
  });
  setData(data);
  return {
    authUserId: user.uId,
    token: newToken
  };
}

function authLogoutV1(token: string) {
  if (getId(token) === -1) {
    
      throw HTTPError(400, 'Bad request');
    
  }
  const data: Data = getData();
  const tokenFinder = data.tokens.findIndex((item) => item.token === token);
  data.tokens[tokenFinder].active = false;
  setData(data);
  return {};
}

export { authRegisterV1, authLoginV1, authLogoutV1 };
