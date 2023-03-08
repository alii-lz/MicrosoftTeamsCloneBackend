function channelDetailsV1(authUserId, channelId) {
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

function channelInviteV1( authUserId, channelId, uId ) {
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
  let newUser = users.find(o => 0.userId === uId);
  let i = 0;
  while (data.channels[i].channelId != courseId) {
    i ++;
  }
  data.channels[i].allMembers.push(newUser); 
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


    
 