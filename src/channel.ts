import { getData, setData } from './dataStore';
import { getId } from './other';
import { error, channelDetails, channelMessages, user, notification, indivNotification } from './interfaces';
import HTTPError from 'http-errors';

import { getUser } from './getUser';
import { notificationsGetV1 } from './notificationGet';

export function channelDetailsV3(token: string, channelId: number): error | channelDetails {
  const dataStore = getData();
  // No Arugment Case:
  if (token === undefined || token === null || channelId === undefined || channelId === null) {
    // return { error: 'Incorrect Arugment use' };
    throw HTTPError(400, 'Incorrect Arugment use');
  }
  // No case: zero User or Channel
  if (Object.keys(dataStore.users).length < 1) {
    // return { error: 'no User in dataStore' };
    throw HTTPError(400, 'no User in dataStore');
  } else if (Object.keys(dataStore.channels).length < 1) {
    // return { error: 'no channel in dataStore' };
    throw HTTPError(400, 'no channel in dataStore');
  }
  // get User index from token
  const userIndex = getUser(token);
  if (userIndex === -1) {
    return { error: 'Invalid token' };
  }

  // Invalid case: Invalid token argument
  for (let i = 0; i < Object.keys(dataStore.users).length; i++) {
    // breaks when user argument matches with dataStore

    if (dataStore.users[userIndex].uId === dataStore.users[i].uId) {
      break;
      // return error when it reaches the end of the list
    } else if (i === Object.keys(dataStore.users).length - 1) {
      // return { error: 'Invalid token' };
      throw HTTPError(400, 'Invalid token');
    }
  }
  // Invalid case: Invalid channelId argument
  let channelPointer;
  // breaks when channel argument matches with dataStore
  for (let i = 0; i < Object.keys(dataStore.channels).length; i++) {
    if (channelId === dataStore.channels[i].channelId) {
      channelPointer = dataStore.channels[i];
      break;
      // return error when it reaches the end of the list
    } else if (i === Object.keys(dataStore.channels).length - 1) {
      // return { error: 'Invalid channelId' };
      throw HTTPError(400, 'Invalid channelId');
    }
  }
  const authUserId = dataStore.users[userIndex].uId;

  // Not member Case: User is not a member of the channel
  let i = 0;
  while (i < channelPointer.allMembers.length) {
    if (authUserId === channelPointer.allMembers[i].uId) {
      break;
    }
    i++;
  }
  if (i === dataStore.channels[i].allMembers.length) {
    // console.log(authUserId);
    // console.log(dataStore.users[i].uId);
    // return { error: 'User is not a member of the channel' };
    throw HTTPError(403, 'User is not a member of the channel');
  }
  // stores users and channels into an array(s)
  const ownerMembersArray: user[] = [];
  const allMembersArray: user[] = [];
  for (const i in channelPointer.owners) {
    ownerMembersArray.push(channelPointer.owners[i]);
  }
  for (const i in channelPointer.allMembers) {
    allMembersArray.push(channelPointer.allMembers[i]);
  }
  return {
    name: channelPointer.name,
    isPublic: channelPointer.isPublic,
    ownerMembers: ownerMembersArray,
    allMembers: allMembersArray
  };
}

/// ///////////     RETURN REFERENCE       ////////////////
// return {
//     name: 'Hayden',
//     ownerMembers: [
//       {
//         uId: 1,
//         email: 'example@gmail.com',
//         nameFirst: 'Hayden',
//         nameLast: 'Jacobs',
//         handleStr: 'haydenjacobs',
//       }
//     ],
//     allMembers: [
//       {
//         uId: 1,
//         email: 'example@gmail.com',
//         nameFirst: 'Hayden',
//         nameLast: 'Jacobs',
//         handleStr: 'haydenjacobs',
//       }
//     ],
//   };
/// ///////////////////////////////////////////////////////
export function channelJoinV3(token: string, channelId: number): error | object {
  const dataStore = getData();
  // No Arugment Case:
  if (token === undefined || token === null || channelId === undefined || channelId === null) {
    // return { error: 'Incorrect Arugment use' };
    throw HTTPError(400, 'Incorrect Arugment use');
  }
  // No case: zero User or Channel
  if (Object.keys(dataStore.users).length < 1) {
    // return { error: 'no User in dataStore' };
    throw HTTPError(400, 'no User in dataStore');
  } else if (Object.keys(dataStore.channels).length < 1) {
    // return { error: 'no channel in dataStore' };
    throw HTTPError(400, 'no channel in dataStore');
  }
  // get User index from token
  const userIndex = getUser(token);
  if (userIndex === -1) {
    // return { error: 'Invalid token' };
    throw HTTPError(400, 'Invalid token');
  }
  const authUserId = dataStore.users[userIndex].uId;

  // Invalid case: Invalid token argument
  for (let i = 0; i < Object.keys(dataStore.users).length; i++) {
    // breaks when user argument matches with dataStore
    if (authUserId === dataStore.users[i].uId) {
      break;
      // return error when it reaches the end of the list
    } else if (i === Object.keys(dataStore.users).length - 1) {
      // return { error: 'Invalid authUserId' };
      throw HTTPError(400, 'Invalid authUserId');
    }
  }
  // Invalid case: Invalid channelId argument
  let channelPointer;
  // breaks when channel argument matches with dataStore
  for (let i = 0; i < Object.keys(dataStore.channels).length; i++) {
    if (channelId === dataStore.channels[i].channelId) {
      channelPointer = dataStore.channels[i];
      break;
      // return error when it reaches the end of the list
    } else if (i === Object.keys(dataStore.channels).length - 1) {
      // return { error: 'Invalid channelId' };
      throw HTTPError(400, 'Invalid channelId');
    }
  }
  // Private channel Case: cannot join private channel unless global owner
  if (channelPointer.isPublic === false && authUserId !== dataStore.users[0].uId) {
    // return { error: 'Cannot join private channel' };
    throw HTTPError(403, 'Cannot join private channel');
  }
  // Member is in channel Case: returns error when member is already in channel
  for (const i in channelPointer.allMembers) {
    if (authUserId === channelPointer.allMembers[i].uId) {
      // return { error: 'Member is already in the channel' };
      throw HTTPError(403, 'Member is already in the channel');
    }
  }

  let userPointer;
  for (let i = 0; i < Object.keys(dataStore.users).length; i++) {
    if (authUserId === dataStore.users[i].uId) {
      userPointer = dataStore.users[i];
      break;
    }
  }
  // formatting user information
  const incommingUser = {
    uId: userPointer.uId,
    email: userPointer.email,
    nameFirst: userPointer.nameFirst,
    nameLast: userPointer.nameLast,
    handleStr: userPointer.handleStr,
  };

  channelPointer.allMembers.push(incommingUser);
  setData(dataStore);
  return {};
}

/**
  * ChannelIviteV1 takes the first user Id and will invites a second Id into the provided channelId.
  *
  * @param {integer} authUserId - The user Id of the member who is already in the group. This Id is the inviting the second Id into the group.
  * @param {integer} uId - The Id being invited into the group. This Id is not in the group before this function is run.
  * @param {integer} channelId - The Id for the channel which authUserId is trying to invite uId into.
  * ...
  *
  * @returns {null} - This function returns null.
*/

export function channelInviteV1(authUserId: number, channelId: number, uId: number): error | object {
  const data = getData();
  // These if statements check to see if the parameters exist.
  if (authUserId === null || channelId === null || uId === null) {
    // return ({ error: 'Please fill in all fields.' });
    throw HTTPError(400, 'Please fill in all fields.');
  }
  let found1 = false;
  for (let i = 0; i < data.users.length; i++) {
    if (data.users[i].uId === authUserId) {
      found1 = true;
      break;
    }
  }
  if (found1 === false) {
    // return ({ error: 'AUthUserId is not in function' });
    throw HTTPError(400, 'AUthUserId is not in function');
  }
  let found2 = false;
  for (let i = 0; i < data.users.length; i++) {
    if (data.users[i].uId === uId) {
      found2 = true;
      break;
    }
  }
  if (!found2) {
    // return ({ error: 'Invalid uId.' });
    throw HTTPError(400, 'Invalid uId.');
  }
  let key = false;
  for (let a = 0; a < data.channels.length; a++) {
    if (data.channels[a].channelId === channelId) {
      key = true;
    }
  }
  if (key === false) {
    // return ({ error: 'Please enter valid channelId.' });
    throw HTTPError(400, 'Please enter valid channelId.');
  }
  // These if statements check to see if the Id's entered are already apart
  // of the group.
  let channelIndex;
  for (let i = 0; i < data.channels.length; i++) {
    if (data.channels[i].channelId === channelId) {
      channelIndex = i;
    }
  }

  let authIdInChannel = false;
  for (let i = 0; i < data.channels[channelIndex].allMembers.length; i++) {
    if (data.channels[channelIndex].allMembers[i].uId === authUserId) {
      authIdInChannel = true;
      break;
    }
  }
  if (authIdInChannel === false) {
    // return ({ error: 'You are not part of this channel.' });
    throw HTTPError(403, 'You are not part of this channel.');
  }
  /// ///////////////////////////////////
  let channelPointer;
  for (let i = 0; i < Object.keys(data.channels).length; i++) {
    if (channelId === data.channels[i].channelId) {
      channelPointer = data.channels[i];
      break;
    } else if (i === Object.keys(data.channels).length - 1) {
      // return { error: 'Invalid channelId' };
      throw HTTPError(400, 'Invalid channelId');
    }
  }
  // Private channel Case: cannot join private channel unless global owner
  if (channelPointer.isPublic === false && authUserId !== data.users[0].uId) {
    // return { error: 'Cannot join private channel' };
    throw HTTPError(403, 'Cannot join private channel');
  }

  let uIdInChannel = false;
  for (let i = 0; i < data.channels[channelIndex].allMembers.length; i++) {
    if (data.channels[channelIndex].allMembers[i].uId === uId) {
      uIdInChannel = true;
    }
  }
  if (uIdInChannel === true) {
    // return ({ error: 'Member already in channel.' });
    throw HTTPError(400, 'Member already in channel.');
  }
  // All error cases have been sorted. Function will continue beneath.

  let userIndex2 = 0;
  while (data.users[userIndex2].uId !== uId) {
    userIndex2++;
  }
  const newUser = {
    uId: data.users[userIndex2].uId,
    email: data.users[userIndex2].email,
    nameFirst: data.users[userIndex2].nameFirst,
    nameLast: data.users[userIndex2].nameLast,
    handleStr: data.users[userIndex2].handleStr,
  };
  let i = 0;
  while (data.channels[i].channelId !== channelId) {
    i++;
  }
  data.channels[i].allMembers.push(newUser);

  // Making notification //
  // Find handle for authUserId
  let authUserIndex = 0;
  while (data.users[authUserIndex].uId != authUserId) {
    authUserIndex++;
  }
  // Find channel name
  const channelName: string = data.channels[i].name;
  const handleString: string = data.users[authUserIndex].handleStr;
  const newNotification: notification = {
    channelId: channelId,
    dmId: -1,
    notificationMessage: `${handleString} added you to ${channelName}`
  };
  // If first person to have notifications ever, need to make array.
  if (data.indivNotification.length === 0) {
    data.indivNotification = [{
      userId: uId,
      notification: [newNotification]
    }];
  } else {
    let notiIndex = 0;
    while (notiIndex < data.indivNotification.length && data.indivNotification[notiIndex].userId !== uId) {
      notiIndex++;
    }
    if (notiIndex === data.indivNotification.length) {
      data.indivNotification[notiIndex].userId = uId;
      data.indivNotification[notiIndex].notification = [newNotification];
      // This is this user's first notification.
    }
    // User already has notifications.
    else {
      data.indivNotification[notiIndex].notification.unshift(newNotification);
    }
  }
  setData(data);

  return {};
}

/**
  * channelMessagesV2 takes the first user Id, channelId and an integer to display the messages in a channel.
  *
  * @param {integer} authUserId - The user Id of the member who is already in the group and wants to view the messages.
  * @param {integer} channelId - The Id for the channel which authUserId is trying view messages from.
  * @param {integer} start - An integer indicating the message, authUserId wants to start looking from.
  * ...
  *
  * @returns {messages, start, end} - This function returns messages which is an array of objects containing information about a message
  *                                   such as its location in the array of messages, the message, the Id of the user who posted it and the timestamp.
  *                                   'start' is the starting index where the list of messages to display will start from.
  *                                   'end' is the end index. If there are more than 50 messages from where the user indicated 'start', end will equal
  *                                   start + 50. If less, it will equal -1.
*/

export function channelMessagesV1(authUserId: number, channelId: number, start: number): error | channelMessages {
  const data = getData();
  // Check if the parameters have been entered.
  if (authUserId === null || channelId === null || start === null) {
    // return ({ error: 'Please fill in all fields.' });
    throw HTTPError(400, 'Please fill in all fields.');
  }
  let foundChannel = false;
  // loop to see if channelId is valid
  for (let j = 0; j < data.channels.length; j++) {
    if (data.channels[j].channelId === channelId) {
      foundChannel = true;
    }
  }
  if (foundChannel === false) {
    // return ({ error: 'Please enter valid channelId.' });
    throw HTTPError(400, 'Please enter valid channelId.');
  }
  // Check if the IDs are valid (must exist or are the correct type.)
  // If the type was incorrect, it will still be invalid because all IDs are integers.
  // Whatever is entered can be compared to an existing Id.
  let foundAuthUserId = false;
  // loop to see if authUserId is valid

  let channelIndex = 0;
  while (data.channels[channelIndex].channelId !== channelId) {
    channelIndex++;
  }

  for (let i = 0; i < data.channels[channelIndex].allMembers.length; i++) {
    if (data.channels[channelIndex].allMembers[i].uId === authUserId) {
      foundAuthUserId = true;
      break;
    }
  }
  // error checking for if authUserId is valid
  if (foundAuthUserId === false) {
    // return { error: 'User not part of channel.' };
    throw HTTPError(403, 'User not part of channel.');
  }

  // check if start is greater than the number of messages.
  const numberOfMessages = 0;
  // const channelPassedIndex = data.channels.find(i => i.channelId === channelId);

  // This assumes each messaage cannot be an empty string.
  let nullArray = false;
  if (data.channels[channelIndex].messages === undefined) {
    nullArray = true;
    if (start > 0) {
      // return ({ error: 'Message number entered exceeds the number of messages in this channel.' });
      throw HTTPError(400, 'Message number entered exceeds the number of messages in this channel.');
    }
  }
  if (nullArray === false) {
    let ci = 0;
    while (data.channels[ci].channelId !== channelId) {
      ci++;
    }
    if (data.channels[ci].messages.length <= start && start !== 0) {
      // return ({ error: 'Message number entered exceeds the number of messages in this channel. ' });
      throw HTTPError(400, 'Message number entered exceeds the number of messages in this channel. ');
    }
    // authUserId not in channelId
    let foundauthinside = false;
    let channelIndex = 0;
    while (channelIndex < data.channels.length) {
      if (data.channels[channelIndex].channelId === channelId) {
        break;
      }
      channelIndex++;
    }
    for (let k = 0; k < data.channels[channelIndex].allMembers.length; k++) {
      if (data.channels[channelIndex].allMembers[k].uId === authUserId) {
        foundauthinside = true;
        break;
      }
    }
    // error checking for if channelId is valid
    if (foundauthinside === false) {
      // return { error: 'channelId is invalid' };
      throw HTTPError(400, 'channelId is invalid');
    }
    // Create end number and completesfunctions.

    const messageArrayTemp = [];
    let end;
    if (start + 50 < numberOfMessages) {
      end = start + 50;
      let inc = start;
      while (inc < end) {
        messageArrayTemp.push(data.channels[channelIndex].messages[inc]);
        inc++;
      }
    } else {
      end = -1;
      let inc = start;
      const lastMessageIndex = data.channels[channelIndex].messages.length;
      while (inc < lastMessageIndex) {
        messageArrayTemp.push(data.channels[channelIndex].messages[inc]);
        inc++;
      }
    }

    return {
      messages: messageArrayTemp,
      start: start,
      end: end,
    };
  } else {
    return {
      messages: [],
      start: start,
      end: -1,
    };
  }
}

export function channelInviteV3(token: string, channelId: number, uId: number): error | object {
  const id = getId(token);
  if (id === -1) {
    throw HTTPError(403, 'Invalid token.');
    // return { error: 'Invalid token.' };
  }
  return channelInviteV1(id, channelId, uId);
}

export function channelMessagesV3(token: string, channelId: number, start: number): error | channelMessages {
  const id = getId(token);
  if (id === -1) {
    throw HTTPError(403, 'Invalid token.');
    // return { error: 'Invalid token.' };
  }
  return channelMessagesV1(id, channelId, start);
}
