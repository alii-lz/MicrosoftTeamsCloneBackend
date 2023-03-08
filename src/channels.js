import { getData } from "./dataStore";

function channelsCreateV1(authUserId, name, isPublic) {    
  return { channelId: 1 }
}

function channelsListV1(authUserId) {
  return {
    channels: [
      {
        channelId: 1,
        name: 'My Channel',
      }
    ],
  }
}

function channelsListAllV1(authUserId) {
  //need adjustments
  const data = getData();
  const channels = [];

  if (authUserId == '') {
    return { error: 'empty authUserId' };
  } else if (authUserId < 0 || authUserId >= data.length) {
    return { error: 'invalid authUserId' };
  }

  for (const channel of data.channels) {
    const current_channel = {
      channelId: channel.channelId,
      name: channel.name,
    };
    channels.push(current_channel);
  }  
    return { channels };
}

export {channelsListAllV1, channelsListV1, channelsCreateV1};