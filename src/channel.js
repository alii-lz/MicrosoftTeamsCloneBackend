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
  // Invalid case: Invalid authUserId argument
  for (let i = 0; i < Object.keys(dataStore.users).length; i++) {
    // breaks when user argument matches with dataStore
    if (UserId === dataStore.users[i].UserId) {
      break;
    // return error when it reaches the end of the list
    } else if (i == Object.keys(dataStore.users).length - 1) {
      return { error: "Invalid authUserId"};
    }
  }
  // Invalid case: Invalid channelId argument
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
//////////////////////////////////////////////////////////
function channelJoinV1(authUserId, channelId) {
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
  // Invalid case: Invalid authUserId argument
  for (let i = 0; i < Object.keys(dataStore.users).length; i++) {
    // breaks when user argument matches with dataStore
    if (UserId === dataStore.users[i].UserId) {
      break;
    // return error when it reaches the end of the list
    } else if (i == Object.keys(dataStore.users).length - 1) {
      return { error: "Invalid authUserId"};
    }
  }
  // Invalid case: Invalid Channel argument
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
  // Private channel Case: cannot join private channel unless global owner
  if (Channel_Pointer.isPublic === false && authUserId != dataStore.globalowner) {
    return { error: 'Cannot join private channel'}
  }
  // Member is in channel Case: returns error when member is already in channel
  for (i in Channel_Pointer.allMembers) {
    if (authUserId == Channel_Pointer.allMembers.userId) {
      return { error: 'Member is already in the channel'};
    } 
  }

  let User_Pointer;
  for (let i = 0; i < Object.keys(dataStore.users).length; i++) {
    if (UserId === dataStore.users[i].UserId) {
      User_Pointer = dataStore.user[i];
      break;
    }
  }
  // formatting user information
  let Incomming_User = {
    userId: User_Pointer.userId,
    nameFirst: User_Pointer.nameFirst,
    nameLast: User_Pointer.nameLast,
    email: User_Pointer.email,
    handleStr: User_Pointer.handleStr,
  }

  Channel_Pointer.allMembers.push(Incomming_User);
  setData(dataStore);
    return {};
}

export function channelInviteV1( authUserId, channelId, uId ) {
  // These if statements check to see if the parameters exist. 
  if (authUserId == null || channelId == null || uId == null) {
    return({"error": "Please fill in all fields."})
  }
  const foundAuthId = users.some(a => a.uId === authUserId)
  if (foundAuthId == false) {
    return ({"error": "Please enter valid inviter userId."})
  }
  const foundUId = users.some(b => b.uId === uId)
  if (foundUId == false) {
    return ({"error": "Please enter valid invitee userId."})
  }
  const foundChannelId = channels.some(c => c.channelId === uId)
  if (foundChannelId == false) {
    return ({"error": "Please enter valid channelId."})
  }
  // These if statements check to see if the Id's entered are already apart
  // of the group.
  const authIdInChannel = channels.channelId.allMembers.some(d => d.uId === authUserId)
  if (authIdInChannel == false) {
    return ({"error": "You are not in this group. You cannot invite others in."})
  }
  const uIdInChannel = channels.channelId.allMembers.some(d => d.uId === uId)
  if (uIdInChannel == true) {
    return ({"error": "Member already in group."})
  }
  // All error cases have been sorted. Function will continue beneath.
  let newUser = users.find(o => o.userId === uId);
  let i = 0;
  while (data.channels[i].channelId != courseId) {
    i ++;
  }
  data.channels[i].allMembers.push(newUser); 
  return {};
}

export function channelMessagesV1( authUserId, channelId, start ) {
  // Check if the parameters have been entered.
  if (authUserId == null || channelId == null || start == null) {
    return({"error": "Please fill in all fields."})
  }
  // Check if the IDs are valid (must exist or are the correct type.)
  // If the type was incorrect, it will still be invalid because all IDs are integers. 
  // Whatever is entered can be compared to an existing Id. 
  const foundAuthId = users.some(a => a.uId === authUserId)
  if (foundAuthId == false) {
    return ({"error": "Please enter a valid userId."})
  }
  const foundChannelId = channels.some(c => c.channelId === uId)
  if (foundChannelId == false) {
    return ({"error": "Please enter valid channelId."})
  }
  // check if start is greater than the number of messages.
  let numberOfMessages = 0;
  let channelPassed = data.channels.find(i => i.channelId === channelId);
  // This assumes each messaage cannot be an empty string. 
  while (channelPassed.message[numberOfMessages] != '') {
    numberOfMessages ++;
  }
  if (numberOfMessages <= start) {
    return ({"error": "Message number entered exceeds the number of messages in this channel."})
  }
  // authUserId not in channelId
  const authIdInChannel = channels.channelId.allMembers.some(d => d.uId === authUserId)
  if (authIdInChannel == false) {
    return ({"error": "You are not in this group. You cannot view the messages."})
  }
  // Create end number and completesfunctions. .
  let channelIndex = data.channels.indexOf(channelId);
  let messageArrayTemp = [];
  let end;
  if (start + 50 < numberOfMessages) {
    end = start + 50;
    let inc = start;
    while (inc < end) {
      messageArrayTemp.push(data.channels[channelIndex].message[inc]);
      inc++;
    }
  }
  else {
    end = -1;
    let inc = start;
    let lastMessageIndex = data.channels[channelIndex].message.length;
    while (inc <= lastMessageIndex) {
      messageArrayTemp.push(data.channels[channelIndex].message[inc]);
      inc++;
    }
  }

  return{
    messageArrayTemp,
    'start': start,
    'end': end,
  }
}
  



    
 