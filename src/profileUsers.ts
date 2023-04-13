import { getData, setData } from './dataStore';
import { error, emptyObject } from './interfaces';
import { getId } from './other';
import { getUser } from './getUser';
import validator from 'validator';
import isAlphanumeric from 'is-alphanumeric';

export function profileSetnameV1(token: string, nameFirst: string, nameLast: string): error | emptyObject {
  const dataStore = getData();
  // check correct input arguments
  if (token === null || nameFirst === null || nameLast === null) {
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

export function profileSetemailV1(token: string, email: string): error | emptyObject {
  const dataStore = getData();
  // check correct input arguments
  if (token === undefined || token === null ||
    email === undefined || email === null) {
    return { error: 'Incorrect Arugment use' };
  }
  // checks if the email is correct
  if (validator.isEmail(email) === false) {
    return { error: 'Invalid email' };
  }
  // Check if email is repeated -- Arden Sae-Ueng
  let i = 0;
  while (i < dataStore.users.length) {
    if (dataStore.users[i].email === email) {
      return { error: 'Email already in use.' }
    }
    i++;
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
  //handleStr = handleStr.toLowerCase();
  if (!isAlphanumeric(handleStr)) {
    return { error: 'handleStr must be alphaNumeric' };
  }

  // get userIndex from token
  const userId = getId(token);
  // check if it is a valid token
  if (userId === -1) {
    return { error: 'Invalid token' };
  }
  // check if only lower case -- Arden Sae-Ueng
  let handleStrCopy = handleStr.slice()
  handleStrCopy = handleStr.toLowerCase();
  if (handleStrCopy !== handleStr) {
    return { error: 'Only lower case allowed' };
  }
  // Finding the user Index -- Arden Sae-Ueng
  let userIndex = 0
  while (userIndex < dataStore.users.length && dataStore.users[userIndex].uId !== userId) {
    userIndex++;
  }
  if (userIndex === dataStore.users.length) {
    return { error: "Invalid User" }
  }
  // check whether handleStr has already been taken
  for (let i = 0; i < dataStore.users.length; i++) {
    //console.log(dataStore.users[i].handleStr)
    if (dataStore.users[i].handleStr === handleStr) {
      return { error: 'handleStr has already been taken' };
    }
  }
  dataStore.users[userIndex].handleStr = handleStr;
  setData(dataStore);
  return {};
}
