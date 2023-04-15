import { getData } from './dataStore';

import { error } from './interfaces';

import { getId } from './other';

/**
 * <remove user with user id uId as an owner of the channel>
 *
 * @param {string} token - The token of the user who is removing the owner.
 * @param {number} channelId - The Id of the channel which the user is trying to remove an owner from.
 * @param {number} uId - The Id of the user who is being removed as an owner.
 *
 * @returns {object} - This function returns an empty object if the user has been removed as an owner.
 *
 * @throws {error} - This function throws an error when the token is invalid, the channelId does not refer to a valid channel,
 *                   the uId does not refer to a valid user, the uId refers to a user who is not an owner of the channel,
 *                   uId refers to the only owner of the channel or channelId is valid and the authorised user does not
 *                   have owner permissions in the channel.
 */
export function channelRemoveOwnerV1(token: string, channelId: number, uId: number): error | object {
  const data = getData();

  const id = getId(token);
  if (id === -1) {
    return ({ error: 'Invalid token.' });
  }

  // return error when channelId does not refer to a valid channel
  if (data.channels.find(i => i.channelId === channelId) === undefined) {
    return ({ error: 'channelId does not refer to a valid channel.' });
  }

  // return error when uId does not refer to a valid user
  if (data.users.find(i => i.uId === uId) === undefined) {
    return ({ error: 'uId does not refer to a valid user.' });
  }

  // return error when uId refers to a user who is not an owner of the channel
  // Rewriting this -- Arden Sae-Ueng
  // if (data.channels.find(i => i.channelId === channelId).owners.find((j: { uId: number; }) => j.uId === uId) === undefined) {
  //   return ({ error: 'uId refers to a user who is not an owner of the channel.' });
  // }
  let channelIndex: number;
  // const id: number = getId(token);
  // let found = false;
  // check if channelId refers to a valid channel

  for (let i = 0; i < data.channels.length; i++) {
    if (data.channels[i].channelId === channelId) {
      channelIndex = i;
      // found = true;
      break;
    }
  }
  let mainUserIndex = 0;
  // let userToAddIndex = 0;
  let foundMainUser = false;
  let foundUserToAdd = false;
  for (let i = 0; i < data.users.length; i++) {
    if (data.users[i].uId === id) {
      foundMainUser = true;
      mainUserIndex = i;
    }
    if (data.users[i].uId === uId) {
      // userToAddIndex = i;
      foundUserToAdd = true;
    }
  }
  if (foundMainUser === false || foundUserToAdd === false) {
    return { error: 'Users missing' };
  }
  let permission = false;
  for (let i = 0; i < data.channels[channelIndex].owners.length; i++) {
    if (data.channels[channelIndex].owners[i].uId === id) {
      mainUserIndex = i;
      permission = true;
    }
  }

  if (permission === false) {
    return { error: 'authorised user does not have owner permissions in the channel' };
  }

  if (data.users[mainUserIndex].globalOwner === false) {
    return { error: 'authorised user does not have owner permissions in the channel' };
  }

  // return error when uId refers to the only owner of the channel
  // Rewritten -- Arden Sae-Ueng Reason: This does not seem to work. Success test fails on this line.
  // if (data.channels.find(i => i.channelId === channelId).owners.length === 1) {
  //   return ({ error: 'uId refers to the only owner of the channel.' });
  // }
  if (data.channels[channelIndex].owners.length === 1 && data.channels[channelIndex].owners[0].uId === uId) {
    return ({ error: 'uId refers to the only owner of the channel.' });
  }

  // return error when channelId is valid and the authorised user does not have owner permissions in the channel
  if (data.channels.find(i => i.channelId === channelId).owners.find((j: { uId: number; }) => j.uId === id) === undefined) {
    return ({ error: 'channelId is valid and the authorised user does not have owner permissions in the channel.' });
  }
  let j = 0;
  while (j < data.channels[channelIndex].owners.length && data.channels[channelIndex].owners[j].uId !== uId) {
    j++;
  }
  console.log(data.channels[channelIndex].owners);
  if (j === data.channels[channelIndex].owners.length) {
    return ({ error: 'uId is not an owner' });
  }
  // remove uId from the owners list of the channel
  // let channelIndex = 0;
  let ownerIndex = 0;

  // while (data.channels[channelIndex].channelId !== channelId) {
  //   channelIndex++;
  // }

  while (ownerIndex < data.channels[channelIndex].owners.length && data.channels[channelIndex].owners[ownerIndex].uId !== uId) {
    ownerIndex++;
  }

  data.channels[channelIndex].owners.splice(ownerIndex, 1);

  // return empty object
  return ({});
}
