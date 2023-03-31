import { getData, setData } from './dataStore';
import { error } from './interfaces';
import { getUser } from './getUser';
import validator from 'validator';
import isAlphanumeric from 'is-alphanumeric';

export function profileSetnameV1(token: string, nameFirst: string, nameLast: string): error | {} {
  const dataStore = getData();
  // check correct input arguments
  if (token === undefined || token === null ||
    nameFirst === undefined || nameFirst === null ||
    nameLast === undefined || nameLast === null) {
    return { error: 'Incorrect Arugment use' };
  }
  // check if first or last name is between 1 and 50 characters
  if (nameFirst.length > 50 || nameLast.length > 50 ||
    nameFirst.length < 1 || nameLast.length < 1) {
    return { error: 'First or Last name exceed 50 character' };
  }
  // get userIndex from token
  const userIndex = getUser(token);
  // check if it is a valid token
  if (userIndex === -1) {
    return { error: 'Invalid token' };
  }
  // sets user first and last name
  dataStore.users[userIndex].nameFirst = nameFirst;
  dataStore.users[userIndex].nameLast = nameLast;
  setData(dataStore);
  return {};
}

export function profileSetemailV1(token: string, email: string): error | {} {
  const dataStore = getData();
  // check correct input arguments
  if (token === undefined || token === null ||
    email === undefined || email === null) {
    return { error: 'Incorrect Arugment use' };
  }
  // checks if the email is correct
  if (validator.isEmail(email) == false) {
    return { error: 'Invalid email' };
  }

  // get userIndex from token
  const userIndex = getUser(token);
  // check if it is a valid token
  if (userIndex === -1) {
    return { error: 'Invalid token' };
  }
  // sets user email
  dataStore.users[userIndex].email = email;
  setData(dataStore);
  return {};
}

export function profileSethandleStrV1(token: string, handleStr: string) {
  const dataStore = getData();
  // check correct input arguments
  if (token === undefined || token === null ||
    handleStr === undefined || handleStr === null) {
    return { error: 'Incorrect Arugment use' };
  }

  // check handleStr is between 3 and 20 characters
  if (handleStr.length > 20 || handleStr.length < 3) {
    return { error: 'handleStr must be between 3 and 20 characters' };
  }

  // lowercase handleStr
  handleStr = handleStr.toLowerCase();
  if (!isAlphanumeric(handleStr)) {
    return { error: 'handleStr must be alphaNumeric' };
  }

  // get userIndex from token
  const userIndex = getUser(token);
  // check if it is a valid token
  if (userIndex === -1) {
    return { error: 'Invalid token' };
  }

  // check whether handleStr has already been taken
  for (let i = 0; i < Object.keys(dataStore.users).length; i++) {
    if (dataStore.users[i].handleStr === handleStr) {
      return { error: 'handleStr has already been taken' };
    }
  }
  dataStore.users[userIndex].handleStr = handleStr;
  setData(dataStore);
}
