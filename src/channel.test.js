import {
  channelDetailsV1,
  channelJoinV1,
  channelInviteV1,
  channelMessagesV1,
} from './channel';

import {
  ClearV1,
} from './other';

import {
  channelsCreateV1,
  channelsListV1,
  channelsListAllV1,
} from './channels';
import {
  authRegisterV1,
  authLoginV1,
} from './auth'

import {
  getData,
} from './dataStore'

const ERROR = { error: expect.any(String) };
//////// channelDetailsV1 ////////
describe('channelDetailsV1(authUserId, channelId): Invalid Inputs', () => {
    let AuthUserId1;
    let AuthUserId2;
    let AuthUserId3;
    let ChannelId1;
    let ChannelId2;
    let ChannelId3;
    beforeEach(() => {
      ClearV1();
      AuthUserId1 = authRegisterV1('harry.potter@gmail.com', 'quidditch', 'Harry', 'Potter');
      AuthUserId2 = authRegisterV1('ron.weasley@gmail.com', 'flying car', 'Ron', 'Weasley');
      AuthUserId3 = authRegisterV1('hermione.granger@gmail.com', 'reading', 'Hermione', 'Granger');
      ChannelId1 = channelsCreateV1(AuthUserId1, 'Quidditch League', true);
      ChannelId2 = channelsCreateV1(AuthUserId2, 'The Weasleys', false);
      ChannelId3 = channelsCreateV1(AuthUserId3, 'Hermione Fan Club', true);
    });
    test('Missing AuthUserId1', () => {
      expect(channelJoinV1('', ChannelId1.channelId)).toStrictEqual(ERROR);
    });
    test('Missing ChannelId1', () => {
      expect(channelJoinV1(AuthUserId1.userId, '')).toStrictEqual({ERROR});
    });
    test('Invalid AuthUserId (not in storeData)', () => {
      expect(channelJoinV1(10101010, ChannelId1.channelId)).toStrictEqual({ERROR});
    });
    test('Invalid ChannelId (not in storeData)', () => {
      expect(channelJoinV1(AuthUserId1.userId, 1010)).toStrictEqual({ERROR});
    });
    test('AuthUserId cannot join the channel because it is a private channel', () => {
      expect(channelJoinV1(AuthUserId3.userId, ChannelId2.channelId)).toStrictEqual({ERROR});
    });
    test('AuthUserId is already a member of the channel', () => {
      expect(channelJoinV1(AuthUserId1.userId, ChannelId1.channelId)).toStrictEqual({ERROR});
    });
  });
  
  describe('channelJoinV1(authUserId, channelId): Correct Results', () => {
    let AuthUserId1;
    let AuthUserId2;
    let AuthUserId3;
    let ChannelId1;
    let ChannelId2;
    let ChannelId3;
    beforeEach(() => {
      ClearV1();
      AuthUserId1 = authRegisterV1('harry.potter@gmail.com', 'quidditch', 'Harry', 'Potter');
      AuthUserId2 = authRegisterV1('ron.weasley@gmail.com', 'flying car', 'Ron', 'Weasley');
      AuthUserId3 = authRegisterV1('hermione.granger@gmail.com', 'reading', 'Hermione', 'Granger');
      ChannelId1 = channelsCreateV1(AuthUserId1, 'Quidditch League', true);
      ChannelId2 = channelsCreateV1(AuthUserId2, 'The Weasleys', false);
      ChannelId3 = channelsCreateV1(AuthUserId3, 'Hermione Fan Club', true);
    });
    test('channelDetailsV1(authUserId, channelId): Harry Potter', () => {
      channelJoinV1(AuthUserId3.userId, ChannelId1.channelId);
      expect(channelDetailsV1(AuthUserId1.userId, ChannelId1.channelId)).toStrictEqual({
        name: 'Quidditch League',
        isPublic: true,
        ownerMembers: [
          {
            uId: expect.any(Number),
            email: 'harry.potter@gmail.com',
            nameFirst: 'Harry',
            nameLast: 'Potter',
            handleStr: 'harrypotter',
          }
        ],
        allMembers: [
          {
            uId: expect.any(Number),
            email: 'harry.potter@gmail.com',
            nameFirst: 'Harry',
            nameLast: 'Potter',
            handleStr: 'harrypotter',
          },
          {
            uId: expect.any(Number),
            email: 'hermione.granger@gmail.com',
            nameFirst: 'Hermione',
            nameLast: 'Granger',
            handleStr: 'hermionegranger',
          },
        ],
      });
    });
    // harry is allowed to join a private channel because he is the globalowner
    test('channelDetailsV1(authUserId, channelId): Ron Weasley', () => {
      channelJoinV1(AuthUserId1.userId, ChannelId2.channelId);
      expect(channelDetailsV1(AuthUserId1.userId, ChannelId2.channelId)).toStrictEqual({
        name: 'The Weasleys',
        isPublic: false,
        ownerMembers: [
          {
            uId: expect.any(Number),
            email: 'ron.weasley@gmail.com',
            nameFirst: 'Ron',
            nameLast: 'Weasley',
            handleStr: 'ronweasley',
          }
        ],
        allMembers: [
          {
            uId: expect.any(Number),
            email: 'ron.weasley@gmail.com',
            nameFirst: 'Ron',
            nameLast: 'Weasley',
            handleStr: 'ronweasley',
          },
          {
            uId: expect.any(Number),
            email: 'harry.potter@gmail.com',
            nameFirst: 'Harry',
            nameLast: 'Potter',
            handleStr: 'harrypotter',
          },
        ],
      });
    });
    // Hermione joins Quiddich League channel
    test('channelDetailsV1(authUserId, channelId): Hermione Granger', () => {
      channelJoinV1(AuthUserId3.userId, ChannelId1.channelId);
      expect(channelDetailsV1(AuthUserId3.userId, ChannelId1.channelId)).toStrictEqual({
        name: 'Quidditch League',
        isPublic: true,
        ownerMembers: [
          {
            uId: expect.any(Number),
            email: 'harry.potter@gmail.com',
            nameFirst: 'Harry',
            nameLast: 'Potter',
            handleStr: 'harrypotter',
          },
        ],
        allMembers: [
          {
            uId: expect.any(Number),
            email: 'harry.potter@gmail.com',
            nameFirst: 'Harry',
            nameLast: 'Potter',
            handleStr: 'harrypotter',
          },
          {
            uId: expect.any(Number),
            email: 'hermione.granger@gmail.com',
            nameFirst: 'Hermione',
            nameLast: 'Granger',
            handleStr: 'hermionegranger',
          },
        ],
      });
    });
  });


//////// channelJoinV1 ////////
describe('channelJoinV1(authUserId, channelId): Invalid Inputs', () => {
  let AuthUserId1;
  let AuthUserId2;
  let AuthUserId3;
  let ChannelId1;
  let ChannelId2;
  let ChannelId3;
  beforeEach(() => {
    ClearV1();
    AuthUserId1 = authRegisterV1('harry.potter@gmail.com', 'quidditch', 'Harry', 'Potter');
    AuthUserId2 = authRegisterV1('ron.weasley@gmail.com', 'flying car', 'Ron', 'Weasley');
    AuthUserId3 = authRegisterV1('hermione.granger@gmail.com', 'reading', 'Hermione', 'Granger');
    ChannelId1 = channelsCreateV1(AuthUserId1, 'Quidditch League', true);
    ChannelId2 = channelsCreateV1(AuthUserId2, 'The Weasleys', false);
    ChannelId3 = channelsCreateV1(AuthUserId3, 'Hermione Fan Club', true);
  });
  test('Missing AuthUserId1', () => {
    expect(channelJoinV1('', ChannelId1.channelId)).toStrictEqual(ERROR);
  });
  test('Missing ChannelId1', () => {
    expect(channelJoinV1(AuthUserId1.userId, '')).toStrictEqual({ERROR});
  });
  test('Invalid AuthUserId (not in storeData)', () => {
    expect(channelJoinV1(10101010, ChannelId1.channelId)).toStrictEqual({ERROR});
  });
  test('Invalid ChannelId (not in storeData)', () => {
    expect(channelJoinV1(AuthUserId1.userId, 1010)).toStrictEqual({ERROR});
  });
  test('AuthUserId cannot join the channel because it is a private channel', () => {
    expect(channelJoinV1(AuthUserId3.userId, ChannelId2.channelId)).toStrictEqual({ERROR});
  });
  test('AuthUserId is already a member of the channel', () => {
    expect(channelJoinV1(AuthUserId1.userId, ChannelId1.channelId)).toStrictEqual({ERROR});
  });
});

describe('channelJoinV1(authUserId, channelId): Correct Results', () => {
  let AuthUserId1;
  let AuthUserId2;
  let AuthUserId3;
  let ChannelId1;
  let ChannelId2;
  let ChannelId3;
  beforeEach(() => {
    ClearV1();
    AuthUserId1 = authRegisterV1('harry.potter@gmail.com', 'quidditch', 'Harry', 'Potter');
    AuthUserId2 = authRegisterV1('ron.weasley@gmail.com', 'flying car', 'Ron', 'Weasley');
    AuthUserId3 = authRegisterV1('hermione.granger@gmail.com', 'reading', 'Hermione', 'Granger');
    ChannelId1 = channelsCreateV1(AuthUserId1, 'Quidditch League', true);
    ChannelId2 = channelsCreateV1(AuthUserId2, 'The Weasleys', false);
    ChannelId3 = channelsCreateV1(AuthUserId3, 'Hermione Fan Club', true);
  });
  test('channelDetailsV1(authUserId, channelId): Harry Potter', () => {
    channelJoinV1(AuthUserId3.userId, ChannelId1.channelId);
    expect(channelDetailsV1(AuthUserId1.userId, ChannelId1.channelId)).toStrictEqual({
      name: 'Harry',
      ownerMembers: [
        {
          uId: expect.any(Number),
          email: 'harry.potter@gmail.com',
          nameFirst: 'Harry',
          nameLast: 'Potter',
          handleStr: 'harrypotter',
        }
      ],
      allMembers: [
        {
          uId: expect.any(Number),
          email: 'harry.potter@gmail.com',
          nameFirst: 'Harry',
          nameLast: 'Potter',
          handleStr: 'harrypotter',
        },
        {
          uId: expect.any(Number),
          email: 'hermione.granger@gmail.com',
          nameFirst: 'Hermione',
          nameLast: 'Granger',
          handleStr: 'hermionegranger',
        },
      ],
    });
  });
  // harry is allowed to join a private channel because he is the globalowner
  test('channelDetailsV1(authUserId, channelId): Ron Weasley', () => {
    channelJoinV1(AuthUserId1.userId, ChannelId2.channelId);
    expect(channelDetailsV1(AuthUserId1.userId, ChannelId1.channelId)).toStrictEqual({
      name: 'Ron',
      ownerMembers: [
        {
          uId: expect.any(Number),
          email: 'ron.weasley@gmail.com',
          nameFirst: 'Ron',
          nameLast: 'Weasley',
          handleStr: 'ronweasley',
        }
      ],
      allMembers: [
        {
          uId: expect.any(Number),
          email: 'ron.weasley@gmail.com',
          nameFirst: 'Ron',
          nameLast: 'Weasley',
          handleStr: 'ronweasley',
        },
        {
          uId: expect.any(Number),
          email: 'harry.potter@gmail.com',
          nameFirst: 'Harry',
          nameLast: 'Potter',
          handleStr: 'harrypotter',
        },
      ],
    });
  });
  // Hermione joins Quiddich League channel
  test('channelDetailsV1(authUserId, channelId): Hermione Granger', () => {
    channelJoinV1(AuthUserId3.userId, ChannelId1.channelId);
    expect(channelDetailsV1(AuthUserId3.userId, ChannelId1.channelId)).toStrictEqual({
      name: 'Hermione',
      ownerMembers: [
        {
          uId: expect.any(Number),
          email: 'harry.potter@gmail.com',
          nameFirst: 'Harry',
          nameLast: 'Potter',
          handleStr: 'harrypotter',
        },
      ],
      allMembers: [
        {
          uId: expect.any(Number),
          email: 'harry.potter@gmail.com',
          nameFirst: 'Harry',
          nameLast: 'Potter',
          handleStr: 'harrypotter',
        },
        {
          uId: expect.any(Number),
          email: 'hermione.granger@gmail.com',
          nameFirst: 'Hermione',
          nameLast: 'Granger',
          handleStr: 'hermionegranger',
        },
      ],
    });
  });
});



describe('channelInviteV1', () => {
  //Tests to see if it works.
  test('Working case', () => {
      ClearV1();
      let authId1 = authRegisterV1('email@outlook.com', 'Password', 'Sam', 'R');
      let authId2 = authRegisterV1('email2@outlook.com', 'Password2', 'Tom', 'S');
      let channelId1 = channelsCreateV1(authId1.authUserId, 'Group_1', true);
      expect(channelInviteV1(authId1.authUserId,channelId1.channelId,authId2.authUserId)).toStrictEqual({})    
  })
  //Tests for missing or invalid parameters. 
  test('Invalid authId', () => {
    ClearV1();
      let authId = authRegisterV1('email@outlook.com', 'Password', 'Sam', 'R');
      let invitedUser = authRegisterV1('email2@outlook.com', 'Password2', 'Tom', 'S');
      let channelId1 = channelsCreateV1(authId.authUserId, 'Group_1', true);
      expect(channelInviteV1((authId.authUserId)*-1,channelId1.channelId,invitedUser.authUserId)).toStrictEqual(ERROR);
  })
  test('Invalid  uId', () => {
    ClearV1();
      let authId1 = authRegisterV1('email@outlook.com', 'Password', 'Sam', 'R');
      let authId2 = authRegisterV1('email2@outlook.com', 'Password2', 'Tom', 'S');
      let authId3 = authRegisterV1('email3@outlook.com', 'Password3', 'Dell', 'IsGarbage')
      let channelId1 = channelsCreateV1(authId1.authUserId, 'Group_1', true);
      expect(channelInviteV1(authId1.authUserId,channelId1.channelId,(authId2.authUserId)*-1)).toStrictEqual(ERROR);
  })
  test('Missing channelId', () => {
    ClearV1();
      let authId1 = authRegisterV1('email@outlook.com', 'Password', 'Sam', 'R');
      let authId2 = authRegisterV1('email2@outlook.com', 'Password2', 'Tom', 'S');
      expect(channelInviteV1(authId1.authUserId,null,authId2.authUserId)).toStrictEqual(ERROR);
  })
  test('Missing authId', () => {
    ClearV1();
      let authId1 = authRegisterV1('email@outlook.com', 'Password', 'Sam', 'R');
      let authId2 = authRegisterV1('email2@outlook.com', 'Password2', 'Tom', 'S');
      let channelId1 = channelsCreateV1(authId1.authUserId, 'Group_1', true);
      expect(channelInviteV1(null,channelId1.channelId,authId2.authUserId)).toStrictEqual(ERROR);
  })
  test('Missing  uId', () => {
    ClearV1();
      let authId1 = authRegisterV1('email@outlook.com', 'Password', 'Sam', 'R');
      let channelId1 = channelsCreateV1(authId1.authUserId, 'Group_1', true);
      expect(channelInviteV1(authId1.authUserId,channelId1.channelId,)).toStrictEqual(ERROR);
  })
  test('Invalid channelId', () => {
    ClearV1();
      let authId1 = authRegisterV1('email@outlook.com', 'Password', 'Sam', 'R');
      let authId2 = authRegisterV1('email2@outlook.com', 'Password2', 'Tom', 'S');
      let channelId1 = channelsCreateV1(authId1.authUserId, 'Group_1', true);
      expect(channelInviteV1(authId1.authUserId,(channelId1.channelId)*-1,authId2.authUserId)).toStrictEqual(ERROR);
  })
  // Tests for either Ids, not having permission or inviting iDs that have already been invited. 
  test('authId not part of channel', () => {
    ClearV1();
      let authId1 = authRegisterV1('email@outlook.com', 'Password', 'Sam', 'R');
      let authId2 = authRegisterV1('email2@outlook.com', 'Password2', 'Tom', 'S');
      let authId3 = authRegisterV1('email3@outlook.com', 'Password3', 'Dell', 'IsGarbage')
      let channelId1 = channelsCreateV1(authId1.authUserId, 'Group_1', true);
      expect(channelInviteV1(authId2.authUserId,channelId1.channelId,authId3.authUserId)).toStrictEqual(ERROR);
  })
  test('uId already part of channel', () => {
    ClearV1();
      let authId1 = authRegisterV1('email@outlook.com', 'Password', 'Sam', 'R');
      let channelId1 = channelsCreateV1(authId1.authUserId, 'Group_1', true);
      expect(channelInviteV1(authId1.authUserId,channelId1.channelId,authId1.authUserId)).toStrictEqual(ERROR);
  })
})

describe('channelMessagesV1', () => {
  let data = getData()
  //Need a working case
  test('Working Case', () =>  {
      ClearV1();
      let authId1 = authRegisterV1('email@outlook.com', 'Password', 'Sam', 'R');
      let channelId1 = channelsCreateV1(authId1.authUserId, 'Group_1', true);
      expect(channelMessagesV1(authId1.authUserId,channelId1.channelId,0)).toStrictEqual({
          messages: [
          ],
          start: 0,
          end: -1,
      })
  })
  //chanID not valid/missing
  test('Invalid channelId', () => {
      ClearV1();
      const user = authRegisterV1('email@outlook.com', 'Password', 'Sam', 'R');
      let channelId1 = channelsCreateV1(user.authUserId, 'Group_1', true);
      expect(channelMessagesV1(user.authUserId,(channelId1.channelId)*-1,0)).toStrictEqual(ERROR);
  })
  test('Missing channelId', () => {
      ClearV1();
      const authId1 = authRegisterV1('email@outlook.com', 'Password', 'Sam', 'R');
      expect(channelMessagesV1(authId1.authUserId,null,0)).toStrictEqual(ERROR);
  })
  //start>total messages.
  test('Start message more than total messages', () => {
      ClearV1();
      const authId1 = authRegisterV1('email@outlook.com', 'Password', 'Sam', 'R');
      let channelId1 = channelsCreateV1(authId1.authUserId, 'Group_1', true);
      expect(channelMessagesV1(authId1.authUserId,channelId1.channelId,100)).toStrictEqual(ERROR);
  })
  //channelId valid but authId not in there
  test('authId not registered',() => {
      ClearV1();
      const authId1 = authRegisterV1('email@outlook.com', 'Password', 'Sam', 'R');
      let authId2 = authRegisterV1('email2@outlook.com', 'Password2', 'Tom', 'S');
      let channelId1 = channelsCreateV1(authId1.authUserId, 'Group_1', true);
      expect(channelMessagesV1(authId2.authUserId,channelId1.channelId,1)).toStrictEqual(ERROR);
  })
  //authId not valid/missing
  test('authId not valid', () => {
      ClearV1();
      const authId1 = authRegisterV1('email@outlook.com', 'Password', 'Sam', 'R');
      let channelId1 = channelsCreateV1(authId1.authUserId, 'Group_1', true);
      let invalidId = authId1.authUserId + 10;
      expect(channelMessagesV1(invalidId,channelId1.channelId,1)).toStrictEqual(ERROR);
  })
  test('authId missing', () => {
      ClearV1();
      const authId1 = authRegisterV1('email@outlook.com', 'Password', 'Sam', 'R');
      let channelId1 = channelsCreateV1(authId1.authUserId, 'Group_1', true);
      expect(channelMessagesV1(null,channelId1.channelId,1)).toStrictEqual(ERROR);
  })
})