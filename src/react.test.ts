
import { reactV1 } from './reactRequestor';
import { requestChannelsCreateV3 } from './channelsRequestor';
import { requestMessageSendV2 } from './messageFunctionRequestors'
import { requestDmCreate } from './dmRequesters';
import { requestAuthRegister } from './authRequesters';
import { requestClear } from './clearRequester';

const OK = 200;
const INPUT_ERROR = 400;
const AUTHORIZATION_ERROR = 403;


let AuthUserId1: { token: string, authUserId: number };
let AuthUserId2: { token: string, authUserId: number };

let dm1: { dmId: number };
let dm2: { dmId: number };

let ChannelId1: { channelId: number };
let ChannelId2: { channelId: number };

let messageId1: { messageId: number }
let messageId2: { messageId: number }

describe('/message/react/v1 failure tests', () => {
  beforeEach(() => {
    requestClear();
    // Initalize AuthUserIds
    const AuthUserId1_return = requestAuthRegister('harry.potter@gmail.com', 'quidditch', 'Harry', 'Potter');
    AuthUserId1 = AuthUserId1_return.returnObj;
    const AuthUserId2_return = requestAuthRegister('ron.weasley@gmail.com', 'flying car', 'Ron', 'Weasley');
    AuthUserId2 = AuthUserId2_return.returnObj;

    // Initalize dms
    const dm1_return = requestDmCreate(AuthUserId1.token, [AuthUserId2.authUserId]);
    dm1 = dm1_return.returnObj;
    const dm2_return = requestDmCreate(AuthUserId2.token, [AuthUserId2.authUserId]);
    dm2 = dm2_return.returnObj;

    // Initalize channelId 
    const channelId1_return = requestChannelsCreateV3(AuthUserId1.token, 'Quidditch League', true);
    ChannelId1 = channelId1_return.returnObj;
    const channelId2_return = requestChannelsCreateV3(AuthUserId2.token, 'Hermione Fan Club', true);
    ChannelId2 = channelId2_return.returnObj;

    // Initalize messages
    const messageId1_return = requestMessageSendV2(AuthUserId1.token, ChannelId1.channelId, 'Quidditch League');
    messageId1 = messageId1_return.returnObj;
    const messageId2_return = requestMessageSendV2(AuthUserId2.token, ChannelId1.channelId, 'Hermione Fan Club');
    messageId2 = messageId2_return.returnObj;
  });

  test('Test 1: Undefined token', () => {
    try {
      const result = reactV1(undefined, dm1.dmId, 1);
      expect(result.returnObj.error).toEqual({ error: expect.any(String) });
      expect(result.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Test 2: Undefined messageId', () => {
    try {
      const result = reactV1(AuthUserId1.token, null, 1);
      expect(result.returnObj.error).toEqual({ error: expect.any(String) });
      expect(result.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Test 3: Undefined reactId', () => {
    try {
      const result = reactV1(AuthUserId1.token, dm1.dmId, null);
      expect(result.returnObj.error).toEqual({ error: expect.any(String) });
      expect(result.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Test 4: Invalid token', () => {
    try {
      const result = reactV1('-1', dm1.dmId, 1);
      expect(result.returnObj.error).toEqual({ error: expect.any(String) });
      expect(result.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Test 5: Invalid MessageId', () => {
    try {
      const result = reactV1(AuthUserId1.token, -1, 1);
      expect(result.returnObj.error).toEqual({ error: expect.any(String) });
      expect(result.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Test 6: Invalid MessageId', () => {
    try {
      const result = reactV1(AuthUserId1.token, dm1.dmId, -1);
      expect(result.returnObj.error).toEqual({ error: expect.any(String) });
      expect(result.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Test 7: token is not apart of messageId', () => {
    try {
      const result = reactV1(AuthUserId2.token, dm1.dmId, 1);
      expect(result.returnObj.error).toEqual({ error: expect.any(String) });
      expect(result.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Test 8: not a valid reactId', () => {
    try {
      const result = reactV1(AuthUserId1.token, messageId1.messageId, -1);
      expect(result.returnObj.error).toEqual({ error: expect.any(String) });
      expect(result.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Test 9: already contains the Authid react', () => {
    try {
      const success = reactV1(AuthUserId1.token, messageId1.messageId, 1);
      const result = reactV1(AuthUserId1.token, messageId1.messageId, 1);
      expect(result.returnObj.error).toEqual({ error: expect.any(String) });
      expect(result.status).toBe(INPUT_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});

describe('/message/react/v1 success case', () => {
  beforeEach(() => {
    requestClear();
    // Initalize AuthUserIds
    const AuthUserId1_return = requestAuthRegister('harry.potter@gmail.com', 'quidditch', 'Harry', 'Potter');
    AuthUserId1 = AuthUserId1_return.returnObj;
    const AuthUserId2_return = requestAuthRegister('ron.weasley@gmail.com', 'flying car', 'Ron', 'Weasley');
    AuthUserId2 = AuthUserId2_return.returnObj;

    // Initalize dms
    const dm1_return = requestDmCreate(AuthUserId1.token, [AuthUserId2.authUserId]);
    dm1 = dm1_return.returnObj;
    const dm2_return = requestDmCreate(AuthUserId2.token, [AuthUserId2.authUserId]);
    dm2 = dm2_return.returnObj;

    // Initalize channelId 
    const channelId1_return = requestChannelsCreateV3(AuthUserId1.token, 'Quidditch League', true);
    ChannelId1 = channelId1_return.returnObj;
    const channelId2_return = requestChannelsCreateV3(AuthUserId2.token, 'Hermione Fan Club', true);
    ChannelId2 = channelId2_return.returnObj;

    // Initalize messages
    const messageId1_return = requestMessageSendV2(AuthUserId1.token, ChannelId1.channelId, 'Quidditch League');
    messageId1 = messageId1_return.returnObj;
    const messageId2_return = requestMessageSendV2(AuthUserId2.token, ChannelId1.channelId, 'Hermione Fan Club');
    messageId2 = messageId2_return.returnObj;
  });

  test('Test 1: Success', () => {
    const result = reactV1(AuthUserId1.token, messageId1.messageId, 1);
    expect(result.returnObj).toStrictEqual({});
    expect(result.status).toBe(OK);
  });

  test('Test 2: Success', () => {
    const result = reactV1(AuthUserId2.token, dm2.dmId, 1);
    expect(result.returnObj).toStrictEqual({});
    expect(result.status).toBe(OK);
  });
});
