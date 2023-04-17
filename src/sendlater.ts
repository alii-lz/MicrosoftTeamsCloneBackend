import { getData, setData, getTimeout } from './dataStore';
import { getId } from './other';
import HTTPError from 'http-errors';
import { messageSendV2 } from './messageFunctions';
import { messageSenddmV2 } from './messageFunctions';


export function sendlaterV1(token: string, channelId: number, message: string, timeSent: number) {
  const data = getData();
  // Check if empty values were entered.
  if (token === '' || token === undefined || channelId === undefined || timeSent === undefined) {
    throw HTTPError(400, 'Missing variables.' );
    // return { error: 'Missing variables.' };
  }
  // Check if the token is valid.
  const uId = getId(token);
  if (uId === -1) {
    throw HTTPError(400, 'Invalid token.' );
    // return { error: 'Invalid token.' };
  }

  if (timeSent < 0) {
    throw HTTPError(400, 'timeSent is in the past.' );
  }
  // check if channelId is valid.
  let channelIndex2 = 0;
  const totalChannelCount = data.channels.length;
  while (channelIndex2 < totalChannelCount && data.channels[channelIndex2].channelId !== channelId) {
    channelIndex2++;
  }
  if (channelIndex2 === totalChannelCount) {
    throw HTTPError(400, 'Invalid channelId.' );
    // return { error: 'Invalid channelId.' };
  }
  // check if message is over 1000 characters or if it is less than one.
  if (message.length >= 1000) {
    throw HTTPError(400, 'Message too long.' );
    // return { error: 'Message too long.' };
  }
  if (message === '') {
    throw HTTPError(400, 'Message too short.' );
    // return { error: 'Message too short.' };
  }
  // Check if user is part of this chanel.
  let channelUserIndex = 0;
  const memberCount = data.channels[channelIndex2].allMembers.length;

  while (channelUserIndex < memberCount && data.channels[channelIndex2].allMembers[channelUserIndex].uId !== uId) {
    channelUserIndex++;
  }
  if (channelUserIndex === memberCount) {
    throw HTTPError(403, 'User is not part of this channel.')
    // return { error: 'User is not part of this channel.' };
  }
  let messageId;
  const timeoutData = getTimeout();
  const timeOutId = setTimeout(() => {
    messageId = messageSendV2(token, channelId, message);
    // timeoutData.timeout.push(timeOutId);
    // setData(data);
    // return messageId;
  }, timeSent * 1000);
  timeoutData.timeout.push(timeOutId);
  setData(data);
  console.log(messageId)
  return messageId;
}

export function sendlaterdmV1(token: string, dmId: number, message: string, timeSent: number) {
  const data = getData();
  // Check if empty values were entered.
  if (token === '' || token === undefined || dmId === undefined || timeSent === undefined) {
    throw HTTPError(400, 'Missing variables.' );
    // return { error: 'Missing variables.' };
  }
  // Check if the token is valid.
  const uId = getId(token);
  if (uId === -1) {
    throw HTTPError(400, 'Invalid token.' );
    // return { error: 'Invalid token.' };
  }

  if (timeSent < 0) {
    throw HTTPError(400, 'timeSent is in the past.' );
  }
  // check if channelId is valid.
  let dmIndex2 = 0;
  const totaldmCount = data.channels.length;
  while (dmIndex2 < totaldmCount && data.dm[dmIndex2].dmId !== dmId) {
    dmIndex2++;
  }
  if (dmIndex2 === totaldmCount) {
    throw HTTPError(400, 'Invalid dmId.' );
    // return { error: 'Invalid channelId.' };
  }
  // check if message is over 1000 characters or if it is less than one.
  if (message.length >= 1000) {
    throw HTTPError(400, 'Message too long.' );
    // return { error: 'Message too long.' };
  }
  if (message === '') {
    throw HTTPError(400, 'Message too short.' );
    // return { error: 'Message too short.' };
  }
  // Check if user is part of this chanel.
  let dmUserIndex = 0;
  const memberCount = data.dm[dmIndex2].members.length;

  while (dmUserIndex < memberCount && data.dm[dmIndex2].members[dmUserIndex] !== uId) {
    dmUserIndex++;
  }
  if (dmUserIndex === memberCount) {
    throw HTTPError(403, 'User is not part of this channel.')
    // return { error: 'User is not part of this channel.' };
  }
  let messageId = messageSenddmV2(token, dmId, message);
  const timeoutData = getTimeout();
  const timeOutId = setTimeout(() => {
    messageId = messageSenddmV2(token, dmId, message);
    // timeoutData.timeout.push(timeOutId);
    // setData(data);
    // return messageId;
  }, timeSent * 1000);
  timeoutData.timeout.push(timeOutId);
  setData(data);
  console.log(messageId)
  return messageId;
}