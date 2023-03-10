import { getData, setData } from "./dataStore.js";


/**
  * <Creates a new channel and returns it's channelId>
  * 
  * @param {number} authUserId - iD of user whos making the new channel
  * @param {string} name - name of new channel
  * @param {boolean} isPublic - whether the channel is public or not
  * 
  * @returns {channelId: number} - returns channelId when new channel is created successfully
*/
function channelsCreateV1(authUserId, name, isPublic) {  
  
  // error checking length of name
  if (name.length > 20 || name.length < 1) {
    return {error: 'name must be between 1 and 20 characters'};
  }

  let channelOwner;
  let data = getData();
  let found = false;
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
    return {error: 'authUserId is invalid'};
  }
  
  // creates a unique channelId
  let newChannelId;
  do {
    newChannelId = Math.floor(Math.random() * 10);
  } while (data.channels.some((channel) => channel.channelId === newChannelId));

  let newChannel = {

    channelId: newChannelId,
    name: name,
    isPublic: isPublic,

    owners: [
      {
        uId: channelOwner.uId,
        nameFirst: channelOwner.nameFirst,
        nameLast: channelOwner.nameLast,
        handleStr: channelOwner.handleStr
      }
    ],
    allMembers: [
      {
        uId: channelOwner.uId,
        nameFirst: channelOwner.nameFirst,
        nameLast: channelOwner.nameLast,
        handleStr: channelOwner.handleStr
      }
    ]
  };
  // setting data
  data.channels.push(newChannel);
  setData(data);

  return {channelId: newChannel.channelId};
}

/**
  * <makes an array of objects where each object is a channel that the given user is part of
  * and returns this array of channel objects >
  * 
  * @param {number} authUserId - iD of user whos making the new channel
  * 
  * @returns {channels: []} - returns an array of channels that the given user is part of
*/
function channelsListV1(authUserId) {

  let found = false;
  let data = getData();
  let user;

  // loop to see if authUserId is valid
  for (let i = 0; i < data.users.length; i++) {
    
    if (data.users[i].uId === authUserId) {
      user = data.users[i];
      found = true;
      break;
    }
  }

  // error checking for if authUserId is valid
  if (found === false) {
    return {error: 'authUserId is invalid'};
  }

  let channels = [];

  // this nested loop finds all channels the given user is a part of.
  for (let i = 0; i < data.channels.length; i++) {

    for (let j = 0; j < data.channels[i].allMembers.length; j++) {

      if (data.channels[i].allMembers[j].uId === authUserId) {

        channels.push({channelId: data.channels[i].channelId, name: data.channels[i].name});
        break; // break so it goes to the next channel
      }
    }
  }

  return {channels: channels};
}


/**
  * <makes an array of objects where each object is either a public or private channel
  * and returns this array of channel objects >
  * 
  * @param {number} authUserId - iD of user whos making the new channel
  * 
  * @returns {channels: []} - returns an array of all channels including public channels and private channels
*/
function channelsListAllV1(authUserId) {
  const data = getData();
  const channels = [];
  let user;
  let found = false;
  
  // loop to see if authUserId is valid
  for (let i = 0; i < data.users.length; i++) {
    if (data.users[i].uId === authUserId) {
      user = data.users[i];
      found = true;
      break;
    }
  }

  // the case when the authUserId (input) is empty
  if (authUserId === '') {
    return { error: 'empty authUserId' };
  }
  // the case when the authUserId is invalid
  // if the authUserId is not valid, return an error message
  else if (found === false) {
    return { error: 'invalid authUserId' };
  } 
  // the case when the authUserId is valid
  else {
    for (const channel of data.channels) {
      // loop through the list of channels from dataStore 
      // and add them to the newly created channels array
      const current_channel = {
        channelId: channel.channelId,
        name: channel.name,
      };
      channels.push(current_channel);
    }
    // return the newly created channels array
    return { channels : channels };
  }
}

export {channelsListAllV1, channelsListV1, channelsCreateV1};