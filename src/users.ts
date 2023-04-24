
import { getData } from './dataStore';
import { error, user } from './interfaces';
import HttpError from 'http-errors';
import { getId } from './other';
/**
  * <returns information about user with given uId, but without the password>
  *
  * @param {number} authUserId - iD of user whos calling the function
  * @param {number} uId - uId of user who's profile details we want
  *
  * @returns {user} - returns a user with uId, but without the password.
*/
export function userProfileV1 (authUserId: number, uId: number): error | {user: user} {
  const data = getData();
  let found = false;
  // loop to see if authUserId is valid
  for (let i = 0; i < data.users.length; i++) {
    if (data.users[i].uId === authUserId) {
      found = true;
      break;
    }
  }
  // error checking for if authUserId is valid
  if (found === false) {
    return { error: 'authUserId is invalid' };
  }
  found = false;
  let userToFind;
  // loop to see if uId is valid
  for (let i = 0; i < data.users.length; i++) {
    if (data.users[i].uId === uId) {
      userToFind = data.users[i];
      found = true;
      break;
    }
  }
  if (found === false) {
    throw HttpError(400, 'uId does not refer to a valid user');
  }
  // clones userToFind, but without their password
  const userToReturn = {
    uId: userToFind.uId,
    email: userToFind.email,
    nameFirst: userToFind.nameFirst,
    nameLast: userToFind.nameLast,
    handleStr: userToFind.handleStr,
  };
  return { user: userToReturn };
}

export function userProfileV3 (token: string, uId: number): error | {user: user} {
  const id = getId(token);
  if (id === -1) {
    throw HttpError(403, 'uId does not refer to a valid user');
  }
  return userProfileV1(id, uId);
}

export function userProfileUploadPhotoV1 (token: string, imgUrl: string, xStart: number,
  yStart: number, xEnd: number, yEnd: number): object {
  const id = getId(token);

  if (id === -1) {
    throw HttpError(403, 'invalid token');
  }

  if (xEnd <= xStart) {
    throw HttpError(400, 'invalid dimension');
  }

  if (yEnd <= yStart) {
    throw HttpError(400, 'invalid dimension');
  }

  if (imgUrl.endsWith('JPG')) { throw HttpError(400, 'invalid dimension'); }
  return {};
}
