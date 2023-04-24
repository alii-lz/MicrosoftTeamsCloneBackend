import { getData, setData } from './dataStore';

import { getId } from './other';

export { Channel, user } from './interfaces';
import HttpError from 'http-errors';

export function channelAddOwnerV1(token: string, channelId: number, uId: number): Object {
  const data = getData();

  let channelIndex: number;
  const id: number = getId(token);
  let found = false;
  // check if channelId refers to a valid channel

  for (let i = 0; i < data.channels.length; i++) {
    if (data.channels[i].channelId === channelId) {
      channelIndex = i;
      found = true;
      break;
    }
  }

  if (found === false) {
    throw HttpError(400, 'channelId does not refer to a valid channel');
  }

  let mainUserIndex;
  // let userToAddIndex;
  let foundMainUser = false;
  let foundUserToAdd = false;

  // check if token and uId refers to a valid user
  for (let i = 0; i < data.users.length; i++) {
    if (data.users[i].uId === id) {
      foundMainUser = true;
      mainUserIndex = i;
    }
    if (data.users[i].uId === uId) {
      // userToAddIndex = i;
      foundUserToAdd = true;
    }
    // mainUserIndex++;
    // userToAddIndex++;
    // Iteration this will ruin its purpose. Commented out. -- Arden Sae-Ueng
  }

  if (foundMainUser === false) {
    throw HttpError(403, 'uId does not refer to a valid user');
  }

  if (foundUserToAdd === false) {
    throw HttpError(400, 'uId does not refer to a valid user');
  }

  let userToAddTruth = false;
  // now we need to check if the userToAdd is not a member of the channel.
  for (let i = 0; i < data.channels[channelIndex].allMembers.length; i++) {
    if (data.channels[channelIndex].allMembers[i].uId === uId) {
      userToAddTruth = true;
      break;
    }
  }

  if (userToAddTruth === false) {
    throw HttpError(400, 'uId refers to a user who is not a member of the channel');
  }

  // search if the user is already an owner
  let alreadyOwner = false;
  for (let i = 0; i < data.channels[channelIndex].owners.length; i++) {
    if (data.channels[channelIndex].owners[i].uId === uId) {
      alreadyOwner = true;
    }
  }

  if (alreadyOwner === true) {
    throw HttpError(400, 'user is already a channel owner');
  }

  // check to see if user whos calling the function has permissions
  // to add someone as channel owner

  let permission = false;
  for (let i = 0; i < data.channels[channelIndex].owners.length; i++) {
    if (data.channels[channelIndex].owners[i].uId === id) {
      mainUserIndex = i;
      permission = true;
    }
  }

  if (permission === false) {
    throw HttpError(403, 'authorised user does not have owner permissions in the channel');
  }

  if (data.users[mainUserIndex].globalOwner === false) {
    throw HttpError(403, 'authorised user does not have owner permissions in the channel');
  }
  // This does not work -- Arden Sae-Ueng
  // data.channels[channelIndex].owners.push(data.users[userToAddIndex]);
  let userIndex = 0;
  while (userIndex < data.users.length && data.users[userIndex].uId !== uId) {
    userIndex++;
  }
  const userAdded = {
    uId: data.users[userIndex].uId,
    email: data.users[userIndex].email,
    nameFirst: data.users[userIndex].nameFirst,
    nameLast: data.users[userIndex].nameLast,
    handleStr: data.users[userIndex].handleStr,
  };
  data.channels[channelIndex].owners.push(userAdded);
  setData(data);

  return {};
}
