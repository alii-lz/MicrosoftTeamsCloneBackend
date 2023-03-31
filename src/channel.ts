import { getData, setData } from './dataStore';
import { getId } from './other';
import { error, channelDetails, channelMessages, user } from './interfaces';

import { getUser} from './getUser'

export function channelDetailsV2(token: string, channelId: number): error | channelDetails {
  const dataStore = getData();
  // No Arugment Case:
  if (token === undefined || token === null || channelId === undefined || channelId === null) {
    return { error: 'Incorrect Arugment use' };
  }
  // No case: zero User or Channel
  if (Object.keys(dataStore.users).length < 1) {
    return { error: 'no User in dataStore' };
  } else if (Object.keys(dataStore.channels).length < 1) {
    return { error: 'no channel in dataStore' };
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
      return { error: 'Invalid token' };
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
      return { error: 'Invalid channelId' };
    }
  }
  const authUserId = dataStore.users[userIndex].uId;

  // Not member Case: User is not a member of the channel
  for (const i in channelPointer.allMembers) {
    if (authUserId === channelPointer.allMembers[i].uId) {
      break;
    } else if (parseInt(i) === dataStore.channels[i].allMembers.length) {
      // console.log(authUserId);
      // console.log(dataStore.users[i].uId);
      return { error: 'User is not a member of the channel' };
    }
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
export function channelJoinV2(token: string, channelId: number): error | object {
  const dataStore = getData();
  // No Arugment Case:
  if (token === undefined || token === null || channelId === undefined || channelId === null) {
    return { error: 'Incorrect Arugment use' };
  }
  // No case: zero User or Channel
  if (Object.keys(dataStore.users).length < 1) {
    return { error: 'no User in dataStore' };
  } else if (Object.keys(dataStore.channels).length < 1) {
    return { error: 'no channel in dataStore' };
  }
  // get User index from token
  const userIndex = getUser(token);
  if (userIndex === -1) {
    return { error: 'Invalid token' };
  }
  const authUserId = dataStore.users[userIndex].uId;

  // Invalid case: Invalid token argument
  for (let i = 0; i < Object.keys(dataStore.users).length; i++) {
    // breaks when user argument matches with dataStore
    if (authUserId === dataStore.users[i].uId) {
      break;
    // return error when it reaches the end of the list
    } else if (i === Object.keys(dataStore.users).length - 1) {
      return { error: 'Invalid authUserId' };
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
      return { error: 'Invalid channelId' };
    }
  }
  // Private channel Case: cannot join private channel unless global owner
  if (channelPointer.isPublic === false && authUserId !== dataStore.users[0].uId) {
    return { error: 'Cannot join private channel' };
  }
  // Member is in channel Case: returns error when member is already in channel
  for (const i in channelPointer.allMembers) {
    if (authUserId === channelPointer.allMembers[i].uId) {
      return { error: 'Member is already in the channel' };
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

export function channelInviteV2(authUserId: number, channelId: number, uId:number): error | object {
  const data = getData();
  // These if statements check to see if the parameters exist.
  if (authUserId == null || channelId == null || uId == null) {
    return ({ error: 'Please fill in all fields.' });
  }
  // const foundAuthId = data.users.some(a => a.uId === authUserId);
  // if (foundAuthId === false) {
  //   return ({ error: 'Please enter valid inviter userId.' });
  // }
  let found1 = false;
  for (let i = 0; i < data.users.length; i++) {
    if (data.users[i].uId === authUserId) {
      found1 = true;
      break;
    }
  }
  // const foundUId = data.users.some(b => b.uId === uId);
  // if (foundUId === false) {
  //   return ({ error: 'Please enter valid invitee userId.' });
  // }
  let found2 = false;
  for (let i = 0; i < data.users.length; i++) {
    if (data.users[i].uId === uId) {
      found2 = true;
      break;
    }
  }
  let key = false;
  for (let a = 0; a < data.channels.length; a++) {
    if (data.channels[a].channelId === channelId) {
      key = true;
    }
  }
  if (key === false) {
    return ({ error: 'Please enter valid channelId.' });
  }
  // These if statements check to see if the Id's entered are already apart
  // of the group.
  let channelIndex;
  for (let i = 0; i < data.channels.length; i++) {
    if (data.channels[i].channelId === channelId) {
      channelIndex = i;
    }
  }

  const authIdInChannel = data.channels[channelIndex].allMembers.includes(authUserId);
  if (authIdInChannel === false) {
    return ({ error: 'You are not part of this channel.' });
  }
  //////////////////////////////////////
  let channelPointer;
  for (let i = 0; i < Object.keys(data.channels).length; i++) {
    if (channelId === data.channels[i].channelId) {
      channelPointer = data.channels[i];
      break;
    } else if (i === Object.keys(data.channels).length - 1) {
      return { error: 'Invalid channelId' };
    }
  }
  // Private channel Case: cannot join private channel unless global owner
  if (channelPointer.isPublic === false && authUserId !== data.users[0].uId) {
    return { error: 'Cannot join private channel' };
  }
  
  const uIdInChannel = data.channels[channelIndex].allMembers.includes(authUserId);
  if (uIdInChannel === true) {
    return ({ error: 'Member already in channel.' });
  }
  // All error cases have been sorted. Function will continue beneath.
  const newUser = data.users.find(o => o.userId === uId);
  let i = 0;
  while (data.channels[i].channelId !== channelId) {
    i++;
  }
  data.channels[i].allMembers.push(newUser);
  return {};
}

/**
  * channelMessagesV1 takes the first user Id, channelId and an integer to display the messages in a channel.
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

export function channelMessagesV2(authUserId: number, channelId: number, start: number): error | channelMessages {
  const data = getData();
  // Check if the parameters have been entered.
  if (authUserId == null || channelId == null || start == null) {
    return ({ error: 'Please fill in all fields.' });
  }
  // Check if the IDs are valid (must exist or are the correct type.)
  // If the type was incorrect, it will still be invalid because all IDs are integers.
  // Whatever is entered can be compared to an existing Id.
  let found = false;
  // loop to see if authUserId is valid
  for (let i = 0; i < data.users.length; i++) {
    if (data.users[i].uId === authUserId) {
      found = true;
      break;
    }
  }
  // error checking for if authUserId is valid
  if (found === false) {
    return { error: 'User not part of channel.' };
  }

  let found2 = false;
  // loop to see if channelId is valid
  for (let j = 0; j < data.channels.length; j++) {
    if (data.channels[j].channelId === channelId) {
      found2 = true;
      break;
    }
  }
  if (found2 === false) {
    return ({ error: 'Please enter valid channelId.' });
  }
  // check if start is greater than the number of messages.
  const numberOfMessages = 0;
  const channelPassed = data.channels.find(i => i.channelId === channelId);
  // This assumes each messaage cannot be an empty string.
  let nullArray = false;
  if (channelPassed.messages === undefined) {
    nullArray = true;
    if (start > 0) {
      return ({ error: 'Message number entered exceeds the number of messages in this channel.' });
    }
  }
  if (nullArray === false) {
    if (channelPassed.messages.length <= start) {
      return ({ error: 'Message number entered exceeds the number of messages in this channel.' });
    }
    // authUserId not in channelId
    let found3 = false;
    // loop to see if authUserId is member of channel. 
    const channelIndex = data.channels.indexOf(channelId)
    for (let k = 0; k < data.channels[channelIndex].length; k++) {
      if (data.channels[channelIndex].allMembers[k] === channelId) {
        found3 = true;
        break;
      }
    }

    // error checking for if authUserId is valid
    if (found3 === false) {
      return { error: 'channelId is invalid' };
    }
    // Create end number and completesfunctions. .
    ;
    const messageArrayTemp = [];
    let end;
    if (start + 50 < numberOfMessages) {
      end = start + 50;
      let inc = start;
      while (inc < end) {
        messageArrayTemp.push(data.channels[channelIndex].message[inc]);
        inc++;
      }
    } else {
      end = -1;
      let inc = start;
      const lastMessageIndex = data.channels[channelIndex].message.length;
      while (inc <= lastMessageIndex) {
        messageArrayTemp.push(data.channels[channelIndex].message[inc]);
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

export function channelInviteV2(token: string, channelId: number, uId: number): error | object {
  const id = getId(token);
  if (id == -1) {
    return {error: "Invalid token."}
  }
  return channelInviteV1(id, channelId, uId);
}

export function channelMessagesV2(token: string, channelId: number, start: number): error | channelMessages {
  const id = getId(token);
  if (id == -1) {
    return {error: "Invalid token."}
  }
  return channelMessagesV1(id, channelId, start);
}

