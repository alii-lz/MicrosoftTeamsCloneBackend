import { getData } from './dataStore';

import { error } from './interfaces';

import { getId } from './other';

/**
 * <Rremove user with user id uId as an owner of the channel>
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
  if (data.channels.find(i => i.channelId === channelId).owners.find((j: { uId: number; }) => j.uId === uId) === undefined) {
    return ({ error: 'uId refers to a user who is not an owner of the channel.' });
  }

  // return error when uId refers to the only owner of the channel
  if (data.channels.find(i => i.channelId === channelId).owners.length === 1) {
    return ({ error: 'uId refers to the only owner of the channel.' });
  }

  // return error when channelId is valid and the authorised user does not have owner permissions in the channel
  if (data.channels.find(i => i.channelId === channelId).owners.find((j: { uId: number; }) => j.uId === id) === undefined) {
    return ({ error: 'channelId is valid and the authorised user does not have owner permissions in the channel.' });
  }

  // remove uId from the owners list of the channel
  let channelIndex = 0;
  let ownerIndex = 0;

  while (data.channels[channelIndex].channelId !== channelId) {
    channelIndex++;
  }

  while (data.channels[channelIndex].owners[ownerIndex].uId !== uId) {
    ownerIndex++;
  }

  data.channels[channelIndex].owners.splice(ownerIndex, 1);

  // return empty object
  return ({});
}
