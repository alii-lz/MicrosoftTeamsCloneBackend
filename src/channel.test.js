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
          }
        ],
      });
    });
    test('channelDetailsV1(authUserId, channelId): Hermione Granger', () => {
      expect(channelDetailsV1(AuthUserId3.userId, ChannelId3.channelId)).toStrictEqual({
        name: 'Hermione',
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