import { getData, setData } from './dataStore';

import { getId } from './other';

import { Channel, Data, user } from './interfaces';
import  HTTPError  from 'http-errors';


import HTTPError from 'http-errors';

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

export function channelsCreateV3 (token: string, name: string, isPublic: boolean): error | channelId {
  if (getId(token) === -1) {
    throw HTTPError(400, 'token doesnt refer to an existing user');
  }
  return channelsCreateV1(getId(token), name, isPublic);
}

/**
  * <Creates a new channel and returns it's channelId>
  *
  * @param {number} authUserId - iD of user whos making the new channel
  * @param {string} name - name of new channel
  * @param {boolean} isPublic - whether the channel is public or not
  *
  * @returns {channelId: number} - returns channelId when new channel is created successfully
*/
function channelsCreateV1(authUserId: number, name: string, isPublic: boolean): error | channelId {
  // error checking length of name
  if (name.length > 20 || name.length < 1) {
    throw HTTPError(400, 'length of name is less than 1 or more than 20 characters');
  }

  let channelOwner: user;
  const data: Data = getData();
  let found: boolean = false;
  // loop to see if authUserId is valid
  for (let i = 0; i < data.users.length; i++) {
    if (data.users[i].uId === authUserId) {
      channelOwner = data.users[i];
      found = true;
      break;
    }
  }

  // error checking for if authUserId is valid
  if (found === false) {
    return { error: 'authUserId is invalid' };
  }

  // creates a unique channelId
  const newChannelId: number = data.channels.length + 1;

  const newChannel: Channel = {

    channelId: newChannelId,
    name: name,
    isPublic: isPublic,
    messages: [],
    owners: [
      {
        uId: channelOwner.uId,
        email: channelOwner.email,
        nameFirst: channelOwner.nameFirst,
        nameLast: channelOwner.nameLast,
        handleStr: channelOwner.handleStr,
      }
    ],
    allMembers: [
      {
        uId: channelOwner.uId,
        email: channelOwner.email,
        nameFirst: channelOwner.nameFirst,
        nameLast: channelOwner.nameLast,
        handleStr: channelOwner.handleStr
      }
    ]
  };
  // setting data
  data.channels.push(newChannel);
  setData(data);

  return { channelId: newChannel.channelId };
}

export function channelsListV3 (token: string): error | {channels: channel[]} {
  const id = getId(token);
  if (id === -1) {
    return { error: 'token is invalid' };
  }
  return channelsListV1(id);
}

/**
  * <makes an array of objects where each object is a channel that the given user is part of
  * and returns this array of channel objects >
  *
  * @param {number} authUserId - iD of user whos calling the function
  *
  * @returns {channels: []} - returns an array of channels that the given user is part of
*/
function channelsListV1(authUserId: number): error | {channels: channel[]} {
  let found = false;
  const data = getData();

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

  const channels: channel[] = [];

  // this nested loop finds all channels the given user is a part of.
  for (let i = 0; i < data.channels.length; i++) {
    for (let j = 0; j < data.channels[i].allMembers.length; j++) {
      if (data.channels[i].allMembers[j].uId === authUserId) {
        channels.push({ channelId: data.channels[i].channelId, name: data.channels[i].name });
        break; // break so it goes to the next channel
      }
    }
  }

  return { channels: channels };
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
export function channelsListAllV3 (token : string) : error | {channels: channel[]} {
  const id = getId(token);
  // error checking for if token is valid
  if (id === -1) {
    // return { error: 'invalid token' };
    throw HTTPError(403, 'invalid token');
  }

  return channelsListAllV1(id);
}

export { channelsListAllV1, channelsListV1, channelsCreateV1 };
