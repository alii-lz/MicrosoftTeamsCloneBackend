import { getData, setData } from './dataStore';

import { getId } from './other';

export { Channel, user } from './interfaces';

interface error {
  error: string;
}

export function channelAddOwnerV1 (token: string, channelId: number, uId: number): object {
  let data = getData();
  
  let channelIndex: number;
  const id: number = getId(token);
  let found: boolean = false;
  // check if channelId refers to a valid channel
  for (let i = 0; i < data.channels.length; i++) {
    if (data.channels[i].channelId === channelId) {
      channelIndex = i;
      found = true;
      break;
    }
    channelIndex++;
  }

  if (found === false) {
    return {error: 'channelId does not refer to a valid channel'};
  }

  found = false;
  let mainUserIndex: number = 0;
  let userToAddIndex: number = 0;
  let foundMainUser: boolean = false;
  let foundUserToAdd: boolean = false;

  // check if token and uId refers to a valid user 
  for (let i = 0; i < data.users.length; i++) {
    if (data.users[i].uId === id) {

      foundMainUser = true;
      mainUserIndex = i;
    }
    if (data.users[i].uId === uId) {
      userToAddIndex = i;
      foundUserToAdd = true;
    }
    mainUserIndex++;
    userToAddIndex++;
  }

  if (foundMainUser === false) {
    return {error: 'token is invalid'};
  }

  if (foundUserToAdd === false) {
    return {error: 'uId does not refer to a valid user'};
  }

  found = false;

  // now we need to check if the userToAdd is not a member of the channel.
  for (let i = 0; i < data.channels[channelIndex].allMembers.length; i++) {
    if (data.channels[channelIndex].allMembers[i].uId === id) {
      found = true;
      break;
    }
  }
  
  if (found === false) {
    return {error: 'user to add is not a member of a channel'};
  }

  // search if the user is already an owner
  let alreadyOwner: boolean = false;
  for (let i = 0; i < data.channels[channelIndex].owners.length; i++) {
    if (data.channels[channelIndex].owners[i].uId === uId) {
      alreadyOwner = true;
    }
  }

  if (alreadyOwner === true) {
    return {error: 'user is already a channel owner'};
  }

  // check to see if user whos calling the function has permissions 
  // to add someone as channel owner

  let permission: boolean = false;
  for (let i = 0; i < data.channels[channelIndex].owners.length; i++) {
    if (data.channels[channelIndex].owners[i].uId === id) {
      mainUserIndex = i;
      permission = true;
    }
  }

  if (permission === false) {
    return {error: 'authorised user does not have owner permissions in the channel'};
  }

  if (data.users[mainUserIndex].globalOwner === false) {
    return {error: 'authorised user does not have owner permissions in the channel'};
  }

  data.channels[channelId].owners.push(data.users[userToAddIndex]);

  setData(data);

  return {}
}

