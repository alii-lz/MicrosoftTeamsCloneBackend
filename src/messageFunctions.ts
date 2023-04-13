// Written by Arden Sae-Ueng
import { getData, setData } from './dataStore';
import { getId } from './other';
const data = getData();
setData(data);
import { error, messageIDReturn } from './interfaces';

/**
  * messageSendV1 sends a messsage to a channel. The message is sent by the uId who owns the token.
  *
  * @param {string} token - The token belonging to the user who wants to send the message. They must be apart of the channel.
  * @param {object} channelId - The Id for the channel which the user is trying send messages to.
  * @param {string} message - The message.
  * ...
  *
  * @returns {messageId} - Returns a number.
*/
export function messageSendV1(token: string, channelId: number, message: string): messageIDReturn | error {
  const data = getData();
  // Check if empty values were entered.
  if (token === '' || channelId === null) {
    return { error: 'Missing variables.' };
  }
  // Check if the token is valid.
  const uId = getId(token);
  if (uId === -1) {
    return { error: 'Invalid token.' };
  }
  // check if channelId is valid.
  let channelIndex2 = 0;
  const totalChannelCount = data.channels.length;
  while (channelIndex2 < totalChannelCount && data.channels[channelIndex2].channelId !== channelId) {
    channelIndex2++;
  }
  if (channelIndex2 === totalChannelCount) {
    return { error: 'Invalid channelId.' };
  }
  // check if message is over 1000 characters or if it is less than one.
  if (message.length >= 1000) {
    return { error: 'Message too long.' };
  }
  if (message === '') {
    return { error: 'Message too short.' };
  }
  // Check if user is part of this chanel.
  let channelUserIndex = 0;
  const memberCount = data.channels[channelIndex2].allMembers.length;

  while (channelUserIndex < memberCount && data.channels[channelIndex2].allMembers[channelUserIndex].uId !== uId) {
    channelUserIndex++;
  }
  if (channelUserIndex === memberCount) {
    return { error: 'User is not part of this channel.' };
  }
  // Save the message and create an ID.
  const messageId = data.messageDetails.length;
  const newMessage = {
    messageId: messageId,
    uId: uId,
    message: message,
    timeSent: Date.now(),
  };
  // This will make it easier to find and delete in the future
  const messgaeDetailEntry = {
    messageId: messageId,
    uId: uId,
    channelId: channelId,
    dmId: -1,
  };
  // Added channel to channelMessages if it doesnt
  // let channelIndex = 0 //data.channels.indexOf(channelId)
  // while (data.channels[channelIndex].channelId !== channelId) {
  //   channelIndex ++;
  // }
  if (data.channels[channelIndex2].messages === undefined) {
    data.channels[channelIndex2].messages = [newMessage];
    if (data.messageDetails === undefined) {
      data.messageDetails = [messgaeDetailEntry];
    } else {
      data.messageDetails.push(messgaeDetailEntry);
    }
    setData(data);
    return { messageId: messageId };
  }
  data.channels[channelIndex2].messages.push(newMessage);
  data.messageDetails.push(messgaeDetailEntry);
  // return id
  setData(data);
  return { messageId: messageId };
}

/**
  * messageEditV1 edits a messsage in a channel. The message is sent by the uId
  * who owns the token or the uId is a global owner.
  *
  * @param {string} token - The token belonging to the user who wants to send the message. They must be apart of the channel.
  * @param {integer} messageId - The Id for the message which the user is trying to edit.
  * @param {string} message - The new message.
  * ...
  *
  * @returns {} - Returns nothing if successful.
*/
export function messageEditV1(token: string, messageId: number, message: string): any | error {
  const data = getData();
  // Check if empty values were entered.
  if (token === '' || messageId === null) {
    return { error: 'Missing variables.' };
  }
  // Check if the token is valid.
  const uId = getId(token);
  if (uId === -1) {
    return { error: 'Invalid token.' };
  }
  // check if messageId is valid.
  let i = 0;
  for (i = 0; i < data.messageDetails.length; i++) {
    if (data.messageDetails[i].messageId === messageId) {
      break;
    }
  }
  if (i === data.messageDetails.length) {
    return { error: 'Invalid messageId.' };
  }

  // check if message is over 1000 characters or if it is less than one.
  if (message.length >= 1000) {
    return { error: 'Message too long.' };
  }
  if (message === '') {
    return {};
  }

  // Check if message belongs to user and if global owner
  // Find index of user in dataStore
  let userIndex = 0;
  while (data.users[userIndex].uId !== uId) {
    userIndex++;
  }
  if (data.messageDetails[i].uId !== uId && data.users[userIndex].globalOwner === false) {
    return { error: 'User is not a global owner. Cannot edit message.' };
  }

  // Edit the message. user is either a global owner or is the original message sender.
  // Find the channel it is in.
  let channelIndex = 0;
  while (data.channels[channelIndex].channelId !== data.messageDetails[i].channelId) {
    channelIndex++;
  }
  // Find the message index of the channel.
  let messageIndexInChannel = 0;
  while (data.channels[channelIndex].messages[messageIndexInChannel].messageId !== messageId) {
    messageIndexInChannel++;
  }
  // Actually replacing the message.
  data.channels[channelIndex].messages[messageIndexInChannel].message = message;
  // return
  setData(data);
  return {};
}

/**
  * messageRemoveV1 edits a messsage in a channel. The message is sent by the uId
  * who owns the token or the uId is a global owner.
  *
  * @param {string} token - The token belonging to the user who wants to remove the message. They must be apart of the channel.
  * @param {integer} messageId - The Id for the message which the user is trying to remove.
  *
  * ...
  *
  * @returns {} - Returns nothing if successful.
*/
export function messageRemoveV1(token: string, messageId: number): any | error {
  const data = getData();
  // Check for missing variables
  if (token === '' || messageId === null) {
    return { error: 'Missing variables.' };
  }
  // Check if the token is valid.
  const uId = getId(token);
  if (uId === -1) {
    return { error: 'Invalid token.' };
  }
  // check if messageId is valid.
  let i = 0;
  const numberOfMessages = data.messageDetails.length;
  while (i < numberOfMessages) {
    if (data.messageDetails[i].messageId === messageId) {
      break;
    }
    i++;
  }
  if (i === numberOfMessages) {
    return { error: 'Invalid messageId.' };
  }

  let userIndex = 0;
  while (data.users[userIndex].uId !== uId) {
    userIndex++;
  }
  if (data.messageDetails[i].uId !== uId && data.users[userIndex].globalOwner === false) {
    return { error: 'User is not a global owner. Cannot remove message.' };
  }
  // Delete the message.
  // Need to find the location of the message.
  let channelIndex = 0;
  while (data.channels[channelIndex].channelId !== data.messageDetails[i].channelId) {
    channelIndex++;
  }

  // Find the message index of the channel.
  let messageIndexInChannel = 0;
  while (data.channels[channelIndex].messages[messageIndexInChannel].messageId !== messageId) {
    messageIndexInChannel++;
  }
  // Actually deleting the message.
  data.channels[channelIndex].messages.splice(messageIndexInChannel, 1);
  // Removing it from the messageDetails
  data.messageDetails.splice(i, 1);
  // Return
  setData(data);
  return {};
}

/**
  * messageSenddmV1 edits a messsage to a dm. The message is sent by the uId
  * who owns the token and is a part of the dm or the uId is a global owner.
  *
  * @param {string} token - The token belonging to the user who wants to remove the message. They must be apart of the channel.
  * @param {integer} dmId - The Id for the dm which the user is trying to send messages to.
  * @param {string} message - The message the user is sending.
  * ...
  *
  * @returns {messageId} - Returns Id of new message if successful.
*/
export function messageSenddmV1(token: string, dmId: number, message: string) {
  const data = getData();
  // Check if empty values were entered.
  if (token === '' || dmId === null) {
    return { error: 'Missing variables.' };
  }
  // Check if the token is valid.
  const uId = getId(token);
  if (uId === -1) {
    return { error: 'Invalid token.' };
  }
  // check if dmId is valid.
  let dmIndex = 0;
  while (dmIndex < data.dm.length && data.dm[dmIndex].dmId !== dmId) {
    dmIndex++;
  }

  if (dmIndex === data.dm.length) {
    console.log(dmIndex, "dmIndex")
    
    return { error: 'Invalid dmId.' };
  }
  // Check if message size is ok
  if (message.length >= 1000) {
    return { error: 'Message too long.' };
  }
  if (message === '') {
    return { error: 'Message too short.' };
  }
  // Check if user is part of dm
  let dmUserIndex = 0;
  while (dmUserIndex < data.dm[dmIndex].members.length && data.dm[dmIndex].members[dmUserIndex] !== uId) {
console.log("MY FUCKING ASS")
    dmUserIndex++;
  }
  if (dmUserIndex === data.dm[dmIndex].members.length) {
    return { error: 'User is not part of DM.' };
  }
  // sendDm and give it a number
  // Make an Id for the message.
  const messageId = data.messageDetails.length;
  const newMessage = {
    messageId: messageId,
    uId: uId,
    message: message,
    timeSent: Date.now(),
  };
  // This will make it easier to find and delete in the future
  const messgaeDetailEntry = {
    messageId: messageId,
    uId: uId,
    channelId: -1,
    dmId: dmId,
  };
  data.messageDetails.push(messgaeDetailEntry);
  data.dm[dmIndex].messages.push(newMessage);
  // return messageId
  setData(data);
  return { messageId };
}
