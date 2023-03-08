import {
    channelDetailsV1,
    channelJoinV1,
    channelInviteV1,
    channelMessagesV1,
  } from './channel'
  
  import {
    authRegisterV1,
    channelsCreateV1,
  } from './channels'
  
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
        clearV1();
        AuthUserId1 = authRegisterV1('harry.potter@gmail.com', 'quidditch', 'Harry', 'Potter');
        AuthUserId2 = authRegisterV1('ron.weasley@gmail.com', 'flying car', 'Ron', 'Weasley');
        AuthUserId3 = authRegisterV1('hermione.granger@gmail.com', 'reading', 'Hermione', 'Granger');
        ChannelId1 = channelsCreateV1(AuthUserId1, 'Quidditch League', true);
        ChannelId2 = channelsCreateV1(AuthUserId2, 'The Weasleys', false);
        ChannelId3 = channelsCreateV1(AuthUserId3, 'Hermione Fan Club', true);
      });
      test('Missing AuthUserId1', () => {
        expect(channelDetailsV1('', ChannelId1.channelId)).toStrictEqual(ERROR);
      });
      test('Missing ChannelId1', () => {
        expect(channelDetailsV1(AuthUserId1.userId, '')).toStrictEqual({ERROR});
      });
      test('Invalid AuthUserId (not in storeData)', () => {
        expect(channelDetailsV1(10101010, ChannelId1.channelId)).toStrictEqual({ERROR});
      });
      test('Invalid ChannelId (not in storeData)', () => {
        expect(channelDetailsV1(AuthUserId1.userId, 1010)).toStrictEqual({ERROR});
      });
      test('AuthUserId is not a member of the channel', () => {
        expect(channelDetailsV1(AuthUserId2.userId, ChannelId3.channelId)).toStrictEqual({ERROR});
      });
  
    describe('channelDetailsV1: Correct Results', () => {
      let AuthUserId1;
      let AuthUserId2;
      let AuthUserId3;
      let ChannelId1;
      let ChannelId2;
      let ChannelId3;
      beforeEach(() => {
        clear();
        AuthUserId1 = authRegisterV1('harry.potter@gmail.com', 'quidditch', 'Harry', 'Potter');
        AuthUserId2 = authRegisterV1('ron.weasley@gmail.com', 'flying car', 'Ron', 'Weasley');
        AuthUserId3 = authRegisterV1('hermione.granger@gmail.com', 'reading', 'Hermione', 'Granger');
        ChannelId1 = channelsCreateV1(AuthUserId1, 'Quidditch League', true);
        ChannelId2 = channelsCreateV1(AuthUserId2, 'The Weasleys', false);
        ChannelId3 = channelsCreateV1(AuthUserId3, 'Hermione Fan Club', true);
      });
      test('channelDetailsV1(authUserId, channelId): Harry Potter', () => {
        expect(channelDetailsV1(AuthUserId1.userId, ChannelId1.channelId)).toStrictEqual({
          name: 'Harry',
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
            }
          ],
        });
      });
      test('channelDetailsV1(authUserId, channelId): Ron Weasley', () => {
        expect(channelDetailsV1(AuthUserId2.userId, ChannelId2.channelId)).toStrictEqual({
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
            }
          ],
        });
      });
      test('channelDetailsV1(authUserId, channelId): Hermione Granger', () => {
        expect(channelDetailsV1(AuthUserId3.userId, ChannelId3.channelId)).toStrictEqual({
          name: 'Hermione Fan Club',
          isPublic: true,
          ownerMembers: [
            {
              uId: expect.any(Number),
              email: 'hermione.granger@gmail.com',
              nameFirst: 'Hermione',
              nameLast: 'Granger',
              handleStr: 'hermionegranger',
            }
          ],
          allMembers: [
            {
              uId: expect.any(Number),
              email: 'hermione.granger@gmail.com',
              nameFirst: 'Hermione',
              nameLast: 'Granger',
              handleStr: 'hermionegranger',
            }
          ],
        });
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
      clearV1();
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
      clearV1();
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
  describe('channelInviteV1', () => {
    beforeEach(() => {
        clear();
        const authId1 = authRegisterV1('email@outlook.com', 'Password', 'Sam', 'R');
        const authId2 = authRegisterV1('email2@outlook.com', 'Password2', 'Tom', 'S');
        const authId3 = authRegisterV1('email3@outlook.com', 'Password3', 'Dell', 'IsGarbage')
        const channelId1 = channelsCreateV1(authId1, 'Group_1', true);
    });
    //Tests to see if it works.
    test('Working case', () => {
        expect(channelInviteV1(authId1,channelId1.channelId,authId2)).toStrictEqual({})    
    })
    //Tests for missing or invalid parameters. 
    test('Invalid authId', () => {
        expect(channelInviteV1((authId1.userId)*-1,channelId1.channelId,authId2.userId)).toStrictEqual(ERROR);
    })
    test('Invalid  uId', () => {
        expect(channelInviteV1(authId1.userId,channelId1.channelId,(authId2.userId)*-1)).toStrictEqual(ERROR);
    })
    test('Missing channelId', () => {
        expect(channelInviteV1(authId1.userId,,authId2.userId)).toStrictEqual(ERROR);
    })
    test('Missing authId', () => {
        expect(channelInviteV1(,channelId1.channelId,authId2.userId)).toStrictEqual(ERROR);
    })
    test('Missing  uId', () => {
        expect(channelInviteV1(authId1.userId,channelId1.channelId,)).toStrictEqual(ERROR);
    })
    test('Invalid channelId', () => {
        expect(channelInviteV1(authId1.userId,(channelId1.channelId)*-1,authId2.userId)).toStrictEqual(ERROR);
    })
    // Tests for either Ids, not having permission or inviting iDs that have already been invited. 
    test('authId not part of channel', () => {
        expect(channelInviteV1(authId2.userId,channelId1.channelId,authId3.userId)).toStrictEqual(ERROR);
    })
    test('uId already part of channel', () => {
        expect(channelInviteV1(authId1.userId,channelId1.channelId,authId1.userId)).toStrictEqual(ERROR);
    })
  })
  
  describe('channelMessagesV1', () => {
    beforeEach(() => {
        clear();
        const authId1 = authRegisterV1('email@outlook.com', 'Password', 'Sam', 'R');
        const authId2 = authRegisterV1('email2@outlook.com', 'Password2', 'Tom', 'S');
        const authId3 = authRegisterV1('email3@outlook.com', 'Password3', 'Dell', 'IsGarbage')
        const channelId1 = channelsCreateV1(authId1, 'Group_1', true);
    });
    //Need a working case
    test('Working Case', () =>  {
        //Test will fail regardless. No function to make messages have been made so a real working case cannot be made. 
        expect(channelMessagesV1(authId1.userId,channelId1.channelId,1)).toStrictEqual({
            '1': [
                messageId: 1,
                uId: authId1.userId,
                message: expect.any(String),
                timeSent: expect.any(Number),
            ],
            '2': [
                messageId: 2,
                uId: authId1.userId,
                message: expect.any(String),
                timeSent: expect.any(Number),
            ],
            start: 1,
            end: -1,
        })
    })
    //chanID not valid/missing
    test('Invalid channelId', () => {
        expect(channelMessagesV1(authId1.userId,(channelId1.channelId)*-1,1)).toStrictEqual(ERROR);
    })
    test('Missing channelId', () => {
        expect(channelMessagesV1(authId1.userId,,1)).toStrictEqual(ERROR);
    })
    //start>total messages.
    test('Start message more than total messages', () => {
        expect(channelMessagesV1(authId1.userId,channelId1.channelId,100)).toStrictEqual(ERROR);
    })
    //channelId valid but authId not in there
    test('authId not registered',() => {
        expect(channelMessagesV1(authId2.userId,channelId1.channelId,1)).toStrictEqual(ERROR);
    })
    //authId not valid/missing
    test('authId not valid', () => {
        expect(channelMessagesV1(authId10.userId,channelId1.channelId,1)).toStrictEqual(ERROR);
    })
    test('authId not missing', () => {
        expect(channelMessagesV1(,channelId1.channelId,1)).toStrictEqual(ERROR);
    })
  })
  