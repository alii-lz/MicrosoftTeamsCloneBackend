import { channel } from 'diagnostics_channel';
import { InvalidatedProjectKind } from 'typescript';
import { getData, setData } from './dataStore';
import { getId } from './other';
let data = getData();
setData(data);
import { error, channelDetails, channelDetailsWithMessages, messageDetails } from './interfaces';

export function messageSendV1(token: string, channelId: number, message: string):Number | error {
  let data = getData();
  // Check if empty values were entered. 
  if (token == '' || channelId == null || message == '') {
    return{error: 'Missing variables.'}
  }
  // Check if the token is valid. 
  const uId = getId(token);
  if (uId == -1) {
    return {error: "Invalid token."}
  }
  // check if channelId is valid.
  let channelPointer;
  let j = 0;
  for (let i = 0; i < Object.keys(data.channels).length; i++) {
    if (channelId === data.channels[i].channelId) {
      channelPointer = data.channels[i];
      j ++;
      break;
      // return error when it reaches the end of the list
    } else if (i === Object.keys(data.channels).length - 1) {
      return { error: 'Invalid channelId.' };
    }
  }
  //check if message is over 1000 characters or if it is less than one. 
  if (message.length >= 1000) {
    return{error: 'Message too long.'}
  }
  if (message == '') {
    return{error: 'Message too short.'}
  }
  // Check if user is part of this chanel. 
  let channelUserIndex = 0;
  while (data.channels[j].users[channelUserIndex].uId != uId ){
    channelUserIndex ++;
  }
  if (channelUserIndex == data.channels[j].users[channelUserIndex].length) {
    return { error: 'User is not part of this channel.'}
  }
  // Save the message and create an ID. 
  const messageId = data.messageDetails.length;
  const newMessage = {
    messageId: messageId,
    uId: uId,
    message: message,
    timeSent: Date.now(),
  }
  // This will make it easier to find and delete in the future
  const messgaeDetailEntry = {
    messageId: messageId,
    uId: uId,
    channelId: channelId,
    dmId: -1,
  }
  // Added channel to channelMessages if it doesnt
  const channelIndex = data.channels.indexOf(channelId)
  data.channels[channelIndex].messages.push(newMessage)
  data.messageDetails.push(messgaeDetailEntry)
  // return id
  setData(data);
  return messageId;
}

export function messageEditV1(token: string, messageId: number, message: string): any|error {
  let data = getData();
  // Check if empty values were entered.
  if (token == '' || messageId == null) {
    return{error: 'Missing variables.'}
  }
  // Check if the token is valid. 
  const uId = getId(token);
  if (uId == -1) {
    return {error: "Invalid token."}
  }
  // check if messageId is valid.
  let i = 0;
  for(i = 0; i < data.messageDetails.length; i++) {
    if (data.messageDetails[i].messageId == messageId) {
      break;
    }
  }
  if (i == data.messageDetails.length) {
    return {error: 'Invalid messageId.'}
  }
  
  //check if message is over 1000 characters or if it is less than one. 
  if (message.length >= 1000) {
    return{error: 'Message too long.'}
  }
  if (message == '') {
    return{}
  }
    
  // Check if message belongs to user and if global owner
  // Find index of user in dataStore
  let userIndex = 0;
  while (data.users[userIndex].uId != uId) {
    userIndex ++;
  }
  if (data.messageDetails[i].uId != uId && data.users[userIndex].globalOwner == false) {
    return{ error: 'User is not a global owner. Cannot edit message.'}
  }

  // Edit the message. user is either a global owner or is the original message sender. 
  // Find the channel it is in.
  let channelIndex = 0;
  while (data.channels[channelIndex].channelId != data.messageDetails[i].channelId) {
    channelIndex ++;
  }
  // Find the message index of the channel. 
  let messageIndexInChannel = 0;
  while (data.channels[channelIndex].messages[messageIndexInChannel].messageId != messageId){
    messageIndexInChannel ++;
  }
  // Actually replacing the message.
  data.channels[channelIndex].messages[messageIndexInChannel].message = message;
  // return
  setData(data);
  return {}
}

export function messageRemoveV1(token: string, messageId: number): any|error {
  let data = getData();
  // Check for missing variables
  if (token == '' || messageId == null) {
    return{error: 'Missing variables.'}
  }
  // Check if the token is valid. 
  const uId = getId(token);
  if (uId == -1) {
    return {error: 'Invalid token.'}
  }
  // check if messageId is valid.
  let i = 0;
  for(i = 0; i < data.messageDetails.length; i++) {
    if (data.messageDetails[i].messageId == messageId) {
      break;
    }
  }
  if (i == data.messageDetails.length) {
    return {error: 'Invalid messageId.'}
  }

  // Check the user can delete it.
  let userIndex = 0;
  while (data.users[userIndex].uId != uId) {
    userIndex ++;
  }
  if (data.messageDetails[i].uId != uId && data.users[userIndex].globalOwner == false) {
    return{ error: 'User is not a global owner. Cannot remove message.'}
  }
  // Delete the message. 
  // Need to find the location of the message. 
  let channelIndex = 0;
  while (data.channels[channelIndex].channelId != data.messageDetails[i].channelId) {
    channelIndex ++;
  }
  // Find the message index of the channel. 
  let messageIndexInChannel = 0;
  while (data.channels[channelIndex].messages[messageIndexInChannel].messageId != messageId){
    messageIndexInChannel ++;
  }
  // Actually deleting the message.
  data.channels[channelIndex].messages.splice(messageIndexInChannel, 1);
  // Removing it from the messageDetails
  data.messageDetails.splice(i, 1);
  // Return
  setData(data);
  return {}
}

export function messageSenddmV1(token: string, dmId: number, message: string) {
  let data = getData();
  // Check if empty values were entered.
  if (token == '' || dmId == null) {
    return{error: 'Missing variables.'}
  }
  // Check if the token is valid. 
  const uId = getId(token);
  if (uId == -1) {
    return {error: 'Invalid token.'}
  }
  // check if dmId is valid.
  let dmIndex = 0;
  while (data.dm[dmIndex].dmId != dmId) {
    dmIndex ++;
  }
  if (dmIndex == data.dm.length) {
    return {error: "Invalid dmId."}
  }
  // Check if message size is ok
  if (message.length >= 1000) {
    return{error: 'Message too long.'}
  }
  if (message == '') {
    return{error: 'Message too short.'}
  }
  // Check if user is part of dm
  let dmUserIndex = 0;
  while(data.dm[dmIndex].users[dmUserIndex].uId != uId) {
    dmUserIndex ++;
  }
  if (dmUserIndex == data.dm[dmIndex].users.length) {
    return {error: 'User is not part of DM.'}
  }
  // sendDm and give it a number
  // Make an Id for the message.
  const messageId = data.messageDetails.length;
  const newMessage = {
    messageId: messageId,
    uId: uId,
    message: message,
    timeSent: Date.now(),
  }
  // This will make it easier to find and delete in the future
  const messgaeDetailEntry = {
    messageId: messageId,
    uId: uId,
    channelId: -1,
    dmId: dmId,
  }
  data.messageDetails.push(messgaeDetailEntry);
  data.dm[dmIndex].messages.push(newMessage);
  // return messageId
  setData(data);
  return {messageId}
}