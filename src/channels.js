import { getData, setData } from "./dataStore.js";

function channelsCreateV1(authUserId, name, isPublic) {
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
  
  let newChannelId;
  do {
    newChannelId = Math.floor(Math.random() * 10);
  } while (data.channels.some((channel) => channel.channelId === newChannelId));   let newChannel = {     channelId: newChannelId,
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
    let channels;
    for (let i = 0; i < data.channels.length; i++) {
      for (let j = 0; j < data.channels[i].allMembers.length; j++) {
        if (data.channels[i].allMembers[j].uId === authUserId) {
          channels.push(data.channels[i]);
          break;
        }
      }
    }
    return {channels: channels};
    // return {
    //   channels: [
    //     {
    //       channelId: 1,
    //       name: 'My Channel',
    //     }
    //   ],
    // }
  }

function channelsListAllV1(authUserId) {
  const data = getData();
  const channels = [];
  let user;
  let found = false;
  
  // Loop to see if authUserId is valid
  for (let i = 0; i < data.users.length; i++) {
    if (data.users[i].uId === authUserId) {
      user = data.users[i];
      found = true;
      break;
    }
  }

  // The case when the authUserId (input) is empty
  if (authUserId === '') {
    return { error: 'empty authUserId' };
  } 
  // Error checking for if authUserId is valid
  // If the authUserId is not valid, return an error message
  else if (found === false) {
    return { error: 'invalid authUserId' };
  } 
  // The case when the authUserId is valid
  else {
    for (const channel of data.channels) {
      // Loop the list of channels from dataStore 
      // and add them to the newly created channels array
      const current_channel = {
        channelId: channel.channelId,
        name: channel.name,
      };
      channels.push(current_channel);
    }
    // Return the newly created channels array
    return { channels : channels };
  }
}

export {channelsListAllV1, channelsListV1, channelsCreateV1};