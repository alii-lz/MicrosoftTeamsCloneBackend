import { getData } from "./dataStore";

function channelDetailsV1(authUserId, channelId) {
  let dataStore = getData()
  // No Arugment Case:
  if (authUserId === undefined || authUserId === null || authUserId === ''
  || channelId === undefined || channelId === null || channelId === '') {
   return {error: "Incorrect Arugment use"};
 }
  // No case: zero User or Channel
  if (Object.keys(dataStore.users).length  < 1) {
    return { error: "no User in dataStore"};
  } else if (Object.keys(dataStore.channels).length  < 1) {
    return { error: "no channel in dataStore"};
  }
  // Invalid case: Invalid channelId argument
  for (let i = 0; i < Object.keys(dataStore.users).length; i++) {
    // breaks when user argument matches with dataStore
    if (UserId === dataStore.users[i].UserId) {
      break;
    // return error when it reaches the end of the list
    } else if (i == Object.keys(dataStore.users).length - 1) {
      return { error: "Invalid authUserId"};
    }
  }
  // Invalid case: Invalid authUserId argument
  let Channel_Pointer;
  // breaks when channel argument matches with dataStore
  for (let i = 0; i < Object.keys(dataStore.channels).length; i++) {
    if (courseId === dataStore.channels[i].channelId) {
      Channel_Pointer = dataStore.channels[i];
      break;
       // return error when it reaches the end of the list
    } else if (i == Object.keys(dataStore.channels).length - 1) {
      return { error: "Invalid channelId"};
    }
  }
  // Not member Case: User is not a member of the channel
  for (i in Channel_Pointer.allMembers) {
    if (authUserId == Channel_Pointer.allMembers.userId) {
      break;
    } else if (i == Object.keys(dataStore.channels.allMembers).length - 1) {
      return {error: "User is not a member of the channel"};
    }
  }
  // stores users and channels into an array(s)
  const ownerMembersArray = [];
  const allMembersArray = [];
  for (let i in Channel_Pointer.ownerMembers) {
    ownerMembersArray.push(Channel_Pointer.ownerMembers[i]);
  }
  for (let i in Channel_Pointer.allMembers) {
    allMembersArray.push(Channel_Pointer.allMembers[i]);
  }
  return {
      name: Channel_Pointer.channelName,
      isPublic: Channel_Pointer.isPublic,
      ownerMembers: ownerMembersArray,
      allMembers:allMembersArray
    }
  };
//////////////     RETURN REFERENCE       ////////////////
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

function channelJoinV1(authUserId, channelId) {
    return {};
}

function channelInviteV1( authUserId, channelId, uId ) {
  return {};
}

function channelMessagesV1( authUserId, channelId, start ) {
  return {messages: [
    {
      messageId: 1,
      uId: 1,
      message: 'Hello world',
      timeSent: 1582426789,
    }
  ],
  start: 0,
  end: 50,}
}


    
 