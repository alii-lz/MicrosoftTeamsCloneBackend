import { getData, setData } from './dataStore';

import { getId } from './other';

interface error {
  error: string;
}

interface channelId {
  channelId: number;
}

interface channel {
  channelId: number,
  name: string
}

/**
  * <makes an array of objects where each object is either a public or private channel
  * and returns this array of channel objects >
  *
  * @param {number} authUserId - iD of user whos making the new channel
  *
  * @returns {channels: []} - returns an array of all channels including public channels and private channels
*/
function channelsListAllV1(authUserId: number | string): error | {channels: channel[]} {
  const data = getData();
  const channels = [];
  let found = false;

  // loop to see if authUserId is valid
  for (let i = 0; i < data.users.length; i++) {
    if (data.users[i].uId === authUserId) {
      found = true;
      break;
    }
  }

  // the case when the authUserId (input) is empty
  if (authUserId === '') {
    return { error: 'empty authUserId' };
  } else if (found === false) {
    // the case when the authUserId is invalid
    // if the authUserId is not valid, return an error message
    return { error: 'invalid authUserId' };
  } else {
  // the case when the authUserId is valid

    for (const channel of data.channels) {
      // loop through the list of channels from dataStore
      // and add them to the newly created channels array
      const currentChannel = {
        channelId: channel.channelId,
        name: channel.name,
      };
      channels.push(currentChannel);
    }
    // return the newly created channels array
    return { channels: channels };
  }
}


/**
 * <makes an array of objects where each object is either a public or private channel
 * and returns this array of channel objects >
 *
 * @param {string} token - token of user whos making the new channel
 *
 * @returns {channels: []} - returns an array of all channels including public channels and private channels
 *
 * @throws {error} - returns an error message if the token is invalid
*/
function channelsListAllV2 (token : string) : error | {channels: channel[]} {
  const id = getId(token);
  // error checking for if token is valid
  if (id === -1) {
    return { error: 'invalid token' };
  }

  return channelsListAllV1(id);
}

export { channelsListAllV1,  channelsListAllV2};
