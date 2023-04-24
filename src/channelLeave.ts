import { getData, setData } from './dataStore';
import { getId } from './other';
export { Channel, user } from './interfaces';
import HttpError from 'http-errors';

export function channelLeaveV2 (token: string, channelId: number): object {
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
    channelIndex++;
  }

  if (found === false) {
    throw HttpError(400, 'channelId does not refer to a valid channel');
  }

  found = false;

  // check if token refers to a valid user
  for (let i = 0; i < data.users.length; i++) {
    if (data.users[i].uId === id) {
      found = true;
      break;
    }
  }

  if (found === false) {
    throw HttpError(403, 'token is does not refer to an existing/active user');
  }

  found = false;

  let userToRemoveIndex: number;
  // now we need to check if the user is not a member of the channel.
  for (let i = 0; i < data.channels[channelIndex].allMembers.length; i++) {
    if (data.channels[channelIndex].allMembers[i].uId === id) {
      userToRemoveIndex = i;
      found = true;
      break;
    }
    userToRemoveIndex++;
  }

  if (found === false) {
    throw HttpError(403, 'user is not member of the channel');
  }

  // now remove the user from the channel.

  data.channels[channelIndex].allMembers.splice(userToRemoveIndex, 1);

  // now search if the user is in owners

  let index: number;
  for (let i = 0; i < data.channels[channelIndex].owners.length; i++) {
    if (data.channels[channelIndex].owners[i].uId === id) {
      index = i;
      break;
    }
    index++;
  }

  data.channels[index].owners.splice(index, 1);

  setData(data);

  return {};
}
