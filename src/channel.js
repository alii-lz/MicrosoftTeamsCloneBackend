export function channelDetailsV1(authUserId, channelId) {
    return {
        name: 'Hayden',
        ownerMembers: [
          {
            uId: 1,
            email: 'example@gmail.com',
            nameFirst: 'Hayden',
            nameLast: 'Jacobs',
            handleStr: 'haydenjacobs',
          }
        ],
        allMembers: [
          {
            uId: 1,
            email: 'example@gmail.com',
            nameFirst: 'Hayden',
            nameLast: 'Jacobs',
            handleStr: 'haydenjacobs',
          }
        ],
      };
}

function channelJoinV1(authUserId, channelId) {
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
  



    
 