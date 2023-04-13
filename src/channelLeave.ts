import { getData, setData } from './dataStore';

import { getId } from './other';

export { Channel, user } from './interfaces';

export function channelLeaveV1 (token: string, channelId: number): object {
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
    return { error: 'channelId does not refer to a valid channel' };
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
    return { error: 'token is invalid' };
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
    return { error: 'user is not a member of a channel' };
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
