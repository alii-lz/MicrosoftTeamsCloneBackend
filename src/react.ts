import { getData, setData } from './dataStore';
import { user } from './interfaces';
import { getId } from './other';
import HTTPError from 'http-errors';

export function reactV1(token: string, messageId: number, reactId: number) {
  const dataStore = getData();
  // check if arugment is empty
  if (messageId === undefined || token === undefined || reactId === undefined) {
    throw HTTPError(400, 'Missing Inputs');
  }
  // check valid id
  const user = getId(token);
  if (user === -1) {
    throw HTTPError(400, 'Invalid token');
  }
  // check valid reactId
  if (reactId !== 1) {
    throw HTTPError(400, 'Invalid reactId');
  }

  // check if messageId is valid.
  let i = 0;
  for (i = 0; i < dataStore.messageDetails.length; i++) {
    if (dataStore.messageDetails[i].messageId === messageId) {
      break;
    }
  }

  if (i === dataStore.messageDetails.length) {
    throw HTTPError(400, 'Invalid messageId.' );
    // return { error: 'Invalid messageId.' };
  }

  let isChannelId = false;
  if (dataStore.messageDetails[i].channelId != -1) {
    isChannelId = true;
  }

  if (isChannelId) {
    // Find the channel it is in.
    let channelIndex = 0;
    while (dataStore.channels[channelIndex].channelId !== dataStore.messageDetails[i].channelId) {
      channelIndex++;
    }

    // Find the message index of the channel.
    let messageIndexInChannel = 0;
    while (dataStore.channels[channelIndex].messages[messageIndexInChannel].messageId !== messageId) {
      messageIndexInChannel++;
    }
    if (dataStore.channels[channelIndex].messages[messageIndexInChannel].reacts = []) {
      let array: number[] = [];
      const react = {
        reactId: 1,
        uIds: array,
      }
      dataStore.channels[channelIndex].messages[messageIndexInChannel].reacts.push(react)
    } else {
      for (const m in dataStore.channels[channelIndex].messages[messageIndexInChannel].reacts[0]) {
        if (dataStore.channels[channelIndex].messages[messageIndexInChannel].reacts[0].uIds[m]
          === user) {
            throw HTTPError(400, 'User already reacted' );
          }
      }
    }
    dataStore.channels[channelIndex].messages[messageIndexInChannel].reacts[0].uIds.push(user);
    setData(dataStore);
    return {};
  } else { // dm
    let dmIndex = 0;
    
    while (dataStore.dm[dmIndex].dmId !== dataStore.messageDetails[i].dmId) {
      ///////////////
      console.log(dataStore.dm[dmIndex].dmId)
      console.log(dataStore.messageDetails[i].dmId)
      dmIndex++;
    }
    let messageIndexInDm = 0;
    while (dataStore.dm[dmIndex].messages[messageIndexInDm].messageId !== messageId) {
      messageIndexInDm++;
    }
    if (dataStore.dm[dmIndex].messages[messageIndexInDm].reacts = []) {
      let array: number[] = [];
      const react = {
        reactId: 1,
        uIds: array,
      }
      dataStore.dm[dmIndex].messages[messageIndexInDm].reacts.push(react)
    } else {
      for (const m in dataStore.channels[dmIndex].messages[messageIndexInDm].reacts[0]) {
        if (dataStore.dm[dmIndex].messages[messageIndexInDm].reacts[0].uIds[m]
          === user) {
            throw HTTPError(400, 'User already reacted' );
          }
      }
    }
    dataStore.dm[dmIndex].messages[messageIndexInDm].reacts[0].uIds.push(user);
    setData(dataStore);
    return {};
  }
}













export function unreactV1(token: string, messageId: number, reactId: number) {
  const dataStore = getData();
  // check if arugment is empty
  if (messageId === undefined || token === undefined || reactId === undefined) {
    throw HTTPError(400, 'Missing Inputs');
  }
  // check valid id
  const user = getId(token);
  if (user === -1) {
    throw HTTPError(400, 'Invalid token');
  }
  // check valid reactId
  if (reactId !== 1) {
    throw HTTPError(400, 'Invalid reactId');
  }

  // check if messageId is valid.
  let i = 0;
  for (i = 0; i < dataStore.messageDetails.length; i++) {
    if (dataStore.messageDetails[i].messageId === messageId) {
      break;
    }
  }

  if (i === dataStore.messageDetails.length) {
    throw HTTPError(400, 'Invalid messageId.' );
    // return { error: 'Invalid messageId.' };
  }

  let isChannelId = false;
  if (dataStore.messageDetails[i].channelId != -1) {
    isChannelId = true;
  }

  if (isChannelId) {
    // Find the channel it is in.
    let channelIndex = 0;
    while (dataStore.channels[channelIndex].channelId !== dataStore.messageDetails[i].channelId) {
      channelIndex++;
    }

    // Find the message index of the channel.
    let messageIndexInChannel = 0;
    while (dataStore.channels[channelIndex].messages[messageIndexInChannel].messageId !== messageId) {
      messageIndexInChannel++;
    }

    for (const uId of dataStore.channels[channelIndex].messages[messageIndexInChannel].reacts[0].uIds) {
      if (uId === user) {
        let m = 0;
        while(dataStore.channels[channelIndex].messages[messageIndexInChannel].reacts[0].uIds[m]!= user){
          m ++;
        }
        dataStore.channels[channelIndex].messages[messageIndexInChannel].reacts[0].uIds.splice(m, 1);
        setData(dataStore);
        return {};
        }
    }
    throw HTTPError(400, 'User did not react in channel' );
  } else { // dm
    let dmIndex = 0;
    
    while (dataStore.dm[dmIndex].dmId !== dataStore.messageDetails[i].dmId) {
      //////////////
      dmIndex++;
    }
    let messageIndexInDm = 0;
    while (dataStore.dm[dmIndex].messages[messageIndexInDm].messageId !== messageId) {
      messageIndexInDm++;
    }

    for (const uId of dataStore.dm[dmIndex].messages[messageIndexInDm].reacts[0].uIds) {
      if (uId === user) {
          let m = 0;
          while(dataStore.dm[dmIndex].messages[messageIndexInDm].reacts[0].uIds[m]!= user){
            m ++;
          }
          dataStore.dm[dmIndex].messages[messageIndexInDm].reacts[0].uIds.splice(m, 1)
          setData(dataStore);
          return {};
        }
    }
    throw HTTPError(400, 'User did not react in dm' );
  }
}