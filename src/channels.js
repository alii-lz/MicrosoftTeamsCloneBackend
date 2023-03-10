import { getData, setData } from "./dataStore.js";

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
        email: channelOwner.email,
        nameFirst: channelOwner.nameFirst,
        nameLast: channelOwner.nameLast,
        handleStr: channelOwner.handleStr
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

  return {channelId: newChannel.channelId};
}

function channelsListV1(authUserId) {

  let found = false;
  let data = getData();
  let user;

  // loop to see if authUserId is valid
  for (let i = 0; i < data.users.length; i++) {
    
    if (data.users[i].uId == authUserId) {
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
        break;
      }
    }
  }

  return {channels: channels};
}

function channelsListAllV1(authUserId) {  
  return {
    channels: [
      {
        channelId: 1,
        name: 'My Channel',
      }
    ],
  }
}

export {channelsCreateV1, channelsListAllV1, channelsListV1};