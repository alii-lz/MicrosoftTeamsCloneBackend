import { getData, setData } from './dataStore';
import { getId } from './other';
import { getUser } from './getUser';
import validator from 'validator';
// import { isAlphanumerical } from 'is-alphanumerical'
import HTTPError from 'http-errors';

export function profileSetnameV2(token: string, nameFirst: string, nameLast: string) {
  const dataStore = getData();
  // check correct input arguments
  if (token === null || nameFirst === null || nameLast === null) {
    // return { error: 'Incorrect Arugment use' };
    throw HTTPError(400, 'Incorrect Arugment use');
  }
  // check if first or last name is between 1 and 50 characters
  if (nameFirst.length > 50 || nameLast.length > 50 ||
    nameFirst.length < 1 || nameLast.length < 1) {
    // return { error: 'First or Last name exceed 50 character' };
    throw HTTPError(400, 'First or Last name exceed 50 character');
  }
  // get userIndex from token
  const userIndex = getUser(token);
  // check if it is a valid token
  if (userIndex === -1) {
    // return { error: 'Invalid token' };
    throw HTTPError(400, 'Invalid token');
  }
  // sets user first and last name
  dataStore.users[userIndex].nameFirst = nameFirst;
  dataStore.users[userIndex].nameLast = nameLast;
  setData(dataStore);
  return {};
}

export function profileSetemailV2(token: string, email: string) {
  const dataStore = getData();
  // check correct input arguments
  if (token === undefined || token === null ||
    email === undefined || email === null) {
    // return { error: 'Incorrect Arugment use' };
    throw HTTPError(400, 'Incorrect Arugment use');
  }
  // checks if the email is correct
  if (validator.isEmail(email) === false) {
    return { error: 'Invalid email' };
  }
  // Check if email is repeated -- Arden Sae-Ueng
  let i = 0;
  while (i < dataStore.users.length) {
    if (dataStore.users[i].email === email) {
      // return { error: 'Email already in use.' };
      throw HTTPError(400, 'Email already in use.');
    }
    i++;
  }
  // get userIndex from token
  const userIndex = getUser(token);
  // check if it is a valid token
  if (userIndex === -1) {
    // return { error: 'Invalid token' };
    throw HTTPError(400, 'Invalid token');
  }
  // sets user email
  dataStore.users[userIndex].email = email;
  setData(dataStore);
  return {};
}

export function profileSethandleStrV2(token: string, handleStr: string) {
  const dataStore = getData();
  // check correct input arguments
  if (token === undefined || token === null ||
    handleStr === undefined || handleStr === null) {
    // return { error: 'Incorrect Arugment use' };
    throw HTTPError(400, 'Incorrect Arugment use');
  }

  // check handleStr is between 3 and 20 characters
  if (handleStr.length > 20 || handleStr.length < 3) {
    // return { error: 'handleStr must be between 3 and 20 characters' };
    throw HTTPError(400, 'handleStr must be between 3 and 20 characters');
  }

  // lowercase handleStr
  // handleStr = handleStr.toLowerCase();
  if (/^([a-zA-Z0-9])/.test(handleStr) == false) {
    throw HTTPError(400, 'handleStr must be alphaNumeric');
  }
  /// if (!handleStr.match("[A-Za-z0-9]")) {
  //   // return { error: 'handleStr must be alphaNumeric' };
  //   throw HTTPError(400, 'handleStr must be alphaNumeric');
  // }

  // get userIndex from token
  const userId = getId(token);
  // check if it is a valid token
  if (userId === -1) {
    // return { error: 'Invalid token' };
    throw HTTPError(400, 'Invalid token');
  }
  // check if only lower case
  let handleStrCopy = handleStr.slice();
  handleStrCopy = handleStr.toLowerCase();
  if (handleStrCopy !== handleStr) {
    // return { error: 'Only lower case allowed' };
    throw HTTPError(400, 'Only lower case allowed');
  }
  // Finding the user Index
  let userIndex = 0;
  while (userIndex < dataStore.users.length && dataStore.users[userIndex].uId !== userId) {
    userIndex++;
  }
  if (userIndex === dataStore.users.length) {
    // return { error: 'Invalid User' };
    throw HTTPError(400, 'Invalid User');
  }
  // check whether handleStr has already been taken
  for (let i = 0; i < dataStore.users.length; i++) {
    // console.log(dataStore.users[i].handleStr)
    if (dataStore.users[i].handleStr === handleStr) {
      // return { error: 'handleStr has already been taken' };
      throw HTTPError(400, 'handleStr has already been taken');
    }
  }
  dataStore.users[userIndex].handleStr = handleStr;
  setData(dataStore);
  return {};
}
