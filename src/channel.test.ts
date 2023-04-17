import { requestAuthRegister } from './authRequesters';
import { requestChannelsCreateV3 } from './channelsRequestor';
import { requestClear } from './clearRequester';
import { requestChannelDetailsV3, requestChannelJoinV3 } from './channelRequestor';

const OK = 200;
const INPUT_ERROR = 400;
const AUTHORIZATION_ERROR = 403;

let AuthUserId1: { token: string, authUserId: number };
let AuthUserId2: { token: string, authUserId: number };
let AuthUserId3: { token: string, authUserId: number };

let ChannelId1: { channelId: number };
let ChannelId2: { channelId: number };
let ChannelId3: { channelId: number };

describe('channel/details/v3 failure tests', () => {
  beforeEach(() => {
    requestClear();
    // Initalize AuthUserIds
    const AuthUserId1_return = requestAuthRegister('harry.potter@gmail.com', 'quidditch', 'Harry', 'Potter');
    AuthUserId1 = AuthUserId1_return.returnObj;
    const AuthUserId2_return = requestAuthRegister('aaaaaa@gmail.com', 'asdadasdasdadsa', 'asdasd', 'asdasdasd');
    AuthUserId2 = AuthUserId2_return.returnObj;
    const AuthUserId3_return = requestAuthRegister('hermione.granger@gmail.com', 'reading', 'Hermione', 'Granger');
    AuthUserId3 = AuthUserId3_return.returnObj;

    // Initalize channels
    const channelId1_return = requestChannelsCreateV3(AuthUserId1.token, 'Quidditch League', true);
    ChannelId1 = channelId1_return.returnObj;
    const channelId2_return = requestChannelsCreateV3(AuthUserId3.token, 'Hermione Fan Club', true);
    ChannelId3 = channelId2_return.returnObj;
  });

  test('Test 1: Undefined token', () => {
    try {
      const result = requestChannelDetailsV3(undefined, ChannelId1.channelId);
      expect(result.returnObj.error).toEqual({ error: expect.any(String) });
      expect(result.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Test 2: Undefined channel', () => {
    try {
      const result = requestChannelDetailsV3(AuthUserId1.token, undefined);
      expect(result.returnObj.error).toEqual({ error: expect.any(String) });
      expect(result.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Test 3: Invalid Token (not in storeData)', () => {
    try {
      const result = requestChannelDetailsV3('111', ChannelId1.channelId);
      expect(result.returnObj.error).toEqual({ error: expect.any(String) });
      expect(result.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Test 4: Invalid ChannelId (not in storeData)', () => {
    try {
      const result = requestChannelDetailsV3(AuthUserId1.token, 1010);
      expect(result.returnObj.error).toEqual({ error: expect.any(String) });
      expect(result.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Test 5: AuthUserId is not a member of the channel', () => {
    try {
      const result = requestChannelDetailsV3(AuthUserId2.token, ChannelId3.channelId);
      expect(result.returnObj.error).toEqual({ error: expect.any(String) });
      expect(result.status).toBe(AUTHORIZATION_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});

describe('channel/details/v3 success tests', () => {
  beforeEach(() => {
    requestClear();
    // Initalize AuthUserIds
    const AuthUserId1_return = requestAuthRegister('harry.potter@gmail.com', 'quidditch', 'Harry', 'Potter');
    AuthUserId1 = AuthUserId1_return.returnObj;
    const AuthUserId2_return = requestAuthRegister('aaaaaa@gmail.com', 'asdadasdasdadsa', 'asdasd', 'asdasdasd');
    AuthUserId2 = AuthUserId2_return.returnObj;
    const AuthUserId3_return = requestAuthRegister('hermione.granger@gmail.com', 'reading', 'Hermione', 'Granger');
    AuthUserId3 = AuthUserId3_return.returnObj;

    // Initalize channels
    const channelId1_return = requestChannelsCreateV3(AuthUserId1.token, 'Quidditch League', true);
    ChannelId1 = channelId1_return.returnObj;
    const channelId2_return = requestChannelsCreateV3(AuthUserId3.token, 'Hermione Fan Club', true);
    ChannelId3 = channelId2_return.returnObj;
  });

  test('Test 1: Success', () => {
    const result = requestChannelDetailsV3(AuthUserId1.token, ChannelId1.channelId);
    expect(result.returnObj).toStrictEqual({
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
        }
      ],
    });
    expect(result.status).toBe(OK);
  });

  test('Test 2: Success', () => {
    const result = requestChannelDetailsV3(AuthUserId3.token, ChannelId3.channelId);
    expect(result.returnObj).toStrictEqual({
      name: 'Hermione Fan Club',
      isPublic: true,
      ownerMembers: [
        {
          uId: expect.any(Number),
          email: 'hermione.granger@gmail.com',
          nameFirst: 'Hermione',
          nameLast: 'Granger',
          handleStr: 'hermionegranger'
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
    expect(result.status).toBe(OK);
  });
});

/// ///////////////////////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////

describe('channel/join/v3 failure tests', () => {
  beforeEach(() => {
    requestClear();
    // Initalize AuthUserIds
    const AuthUserId1_return = requestAuthRegister('harry.potter@gmail.com', 'quidditch', 'Harry', 'Potter');
    AuthUserId1 = AuthUserId1_return.returnObj;
    const AuthUserId2_return = requestAuthRegister('ron.weasley@gmail.com', 'flying car', 'Ron', 'Weasley');
    AuthUserId2 = AuthUserId2_return.returnObj;
    const AuthUserId3_return = requestAuthRegister('hermione.granger@gmail.com', 'reading', 'Hermione', 'Granger');
    AuthUserId3 = AuthUserId3_return.returnObj;

    // Initalize channels
    const channelId1_return = requestChannelsCreateV3(AuthUserId1.token, 'Quidditch League', true);
    ChannelId1 = channelId1_return.returnObj;
    const channelId2_return = requestChannelsCreateV3(AuthUserId2.token, 'The Weasleys', false);
    ChannelId2 = channelId2_return.returnObj;
    const channelId3_return = requestChannelsCreateV3(AuthUserId3.token, 'Hermione Fan Club', true);
    ChannelId3 = channelId3_return.returnObj;
  });
  test('Test 1: Undefined token', () => {
    try {
      const result = requestChannelJoinV3(undefined, ChannelId1.channelId);
      expect(result.returnObj.error).toEqual({ error: expect.any(String) });
      expect(result.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Test 2: Undefined channel', () => {
    try {
      const result = requestChannelJoinV3(AuthUserId1.token, undefined);
      expect(result.returnObj.error).toEqual({ error: expect.any(String) });
      expect(result.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Test 3: Invalid Token (not in storeData)', () => {
    try {
      const result = requestChannelJoinV3('111', ChannelId1.channelId);
      expect(result.returnObj.error).toEqual({ error: expect.any(String) });
      expect(result.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Test 4: Invalid ChannelId (not in storeData)', () => {
    try {
      const result = requestChannelJoinV3(AuthUserId1.token, 1010);
      expect(result.returnObj.error).toEqual({ error: expect.any(String) });
      expect(result.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Test 5: AuthUser cannot join a private channel', () => {
    try {
      const result = requestChannelJoinV3(AuthUserId3.token, ChannelId2.channelId);
      expect(result.returnObj.error).toEqual({ error: expect.any(String) });
      expect(result.status).toBe(AUTHORIZATION_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});

describe('channel/join/v3 success tests', () => {
  beforeEach(() => {
    requestClear();
    // Initalize AuthUserIds
    const AuthUserId1_return = requestAuthRegister('harry.potter@gmail.com', 'quidditch', 'Harry', 'Potter');
    AuthUserId1 = AuthUserId1_return.returnObj;
    const AuthUserId2_return = requestAuthRegister('ron.weasley@gmail.com', 'flying car', 'Ron', 'Weasley');
    AuthUserId2 = AuthUserId2_return.returnObj;
    const AuthUserId3_return = requestAuthRegister('hermione.granger@gmail.com', 'reading', 'Hermione', 'Granger');
    AuthUserId3 = AuthUserId3_return.returnObj;

    // Initalize channels
    const channelId1_return = requestChannelsCreateV3(AuthUserId1.token, 'Quidditch League', true);
    ChannelId1 = channelId1_return.returnObj;
    const channelId2_return = requestChannelsCreateV3(AuthUserId2.token, 'The Weasleys', false);
    ChannelId2 = channelId2_return.returnObj;
    const channelId3_return = requestChannelsCreateV3(AuthUserId3.token, 'Hermione Fan Club', true);
    ChannelId3 = channelId3_return.returnObj;
  });
  test('Test 1: Success', () => {
    const result = requestChannelJoinV3(AuthUserId2.token, ChannelId3.channelId);
    expect(result.returnObj).toStrictEqual({});
    expect(result.status).toBe(OK);
  });

  test('Test 2: Success', () => {
    const result = requestChannelJoinV3(AuthUserId3.token, ChannelId1.channelId);
    expect(result.returnObj).toStrictEqual({});
    expect(result.status).toBe(OK);
  });
});
