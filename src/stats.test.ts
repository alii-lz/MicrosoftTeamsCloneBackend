import request from 'sync-request';
import { port, url } from './config.json';
import { requestChannelsCreateV3 } from './channelsRequestor';
import { requestMessageSendV2, requestMessageSendDmV2 } from './messageFunctionRequestors';
import { requestDmCreate } from './dmRequesters';
import { getId } from './other';
import { requestChannelLeaveV2 } from './channelRequestor';

const SERVER_URL = `${url}:${port}`;
const OK = 200;
const AUTHORIZATION_ERROR = 403;
const currTime = Math.floor((new Date()).getTime() / 1000);

beforeEach(() => {
  request('DELETE', SERVER_URL + '/clear/v1', { json: {} });
});
// Wrapper functions

// the reason im using this is because this one has res.body instead of res.body()
// saw a forum post to use the former and this made me pass tests so :D
function requestAuthRegister(email: string, password: string, nameFirst: string, nameLast: string) {
  const res = request(
    'POST',
    SERVER_URL + '/auth/register/v3',
    {
      json: {
        email: email,
        password: password,
        nameFirst: nameFirst,
        nameLast: nameLast,
      },
      timeout: 100
    }
  );
  return { status: res.statusCode, returnObj: JSON.parse(res.body as string) };
}

function requestUserStatsV1(token: string) {
  const res = request(
    'GET',
    SERVER_URL + '/user/stats/v1',
    {
      headers: {
        token: token
      },
      timeout: 100
    }
  );
  return { status: res.statusCode, returnObj: JSON.parse(res.body as string) };
}

function requestUsersStatsV1(token: string) {
  const res = request(
    'GET',
    SERVER_URL + '/users/stats/v1',
    {
      headers: {
        token: token
      },
      timeout: 100
    }
  );
  return { status: res.statusCode, returnObj: JSON.parse(res.body as string) };
}

describe('Tests for /user/stats/v1', () => {
  let user: {status: number, returnObj: {token: string, authUserId: number}};
  let channel: {status: number, returnObj: {channelId: number}};
  let token: string;
  let channelId: number;
  beforeEach(() => {
    user = requestAuthRegister('ali@gmail.com', 'football', 'ali', 'ahmed');
    channel = requestChannelsCreateV3(user.returnObj.token, 'validName', true);
    token = user.returnObj.token;
    channelId = channel.returnObj.channelId;
  });

  test('invalid token', () => {
    try {
      const result = requestUserStatsV1(token + 'a');
      expect(result.status).toBe(AUTHORIZATION_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('no messages/dms success case', () => {
    const result = requestUserStatsV1(token);
    expect(result.status).toBe(OK);
    expect(result.returnObj).toStrictEqual({

      channelsJoined: [{ numChannelsJoined: 1, timeStamp: currTime }],
      dmsJoined: [{ numDmsJoined: 0, timeStamp: currTime }],
      messagesSent: [{ numMessagesSent: 0, timeStamp: currTime }],
      involvementRate: (1) / (1)
    });
  });

  test('messages success case', () => {
    requestMessageSendV2(token, channelId, 'hello');
    const result = requestUserStatsV1(token);
    expect(result.status).toBe(OK);
    expect(result.returnObj).toStrictEqual({

      channelsJoined: [{ numChannelsJoined: 1, timeStamp: currTime }],
      dmsJoined: [{ numDmsJoined: 0, timeStamp: currTime }],
      messagesSent: [{ numMessagesSent: 1, timeStamp: currTime }],
      involvementRate: (1 + 1) / (1 + 1)
    });
  });

  test('dms success case', () => {
    const userInDm = requestAuthRegister('temp@gmail.com', 'temp', 'temp', 'temp');
    const uId = getId(userInDm.returnObj.token);
    const dm = requestDmCreate(token, [uId]);
    requestMessageSendDmV2(token, dm.returnObj.dmId, 'hello');

    const result = requestUserStatsV1(token);
    expect(result.status).toBe(OK);
    expect(result.returnObj).toStrictEqual({

      channelsJoined: [{ numChannelsJoined: 1, timeStamp: currTime }],
      dmsJoined: [{ numDmsJoined: 1, timeStamp: currTime }],
      messagesSent: [{ numMessagesSent: 1, timeStamp: currTime }],
      involvementRate: (1 + 1 + 1) / (1 + 1 + 1)
    });
  });

  test('channel + messages + dms case', () => {
    const userInDm = requestAuthRegister('temp@gmail.com', 'temp', 'temp', 'temp');
    const uId = getId(userInDm.returnObj.token);
    const dm = requestDmCreate(token, [uId]);
    requestMessageSendDmV2(token, dm.returnObj.dmId, 'hello');

    requestMessageSendV2(token, channelId, 'how are you?');

    const result = requestUserStatsV1(token);
    expect(result.status).toBe(OK);
    expect(result.returnObj).toStrictEqual({

      channelsJoined: [{ numChannelsJoined: 1, timeStamp: currTime }],
      dmsJoined: [{ numDmsJoined: 1, timeStamp: currTime }],
      messagesSent: [{ numMessagesSent: 2, timeStamp: currTime }],
      involvementRate: (1 + 1 + 2) / (1 + 1 + 2)
    });
  });

  test('2 channels success case', () => {
    requestMessageSendV2(token, channelId, 'how are you?');
    requestChannelsCreateV3(token, 'temp', true);

    const result = requestUserStatsV1(token);
    expect(result.status).toBe(OK);
    expect(result.returnObj).toStrictEqual({

      channelsJoined: [{ numChannelsJoined: 2, timeStamp: currTime }],
      dmsJoined: [{ numDmsJoined: 0, timeStamp: currTime }],
      messagesSent: [{ numMessagesSent: 1, timeStamp: currTime }],
      involvementRate: (2 + 1) / (2 + 1)
    });
  });

  test('0 involement case', () => {
    request('DELETE', SERVER_URL + '/clear/v1', { json: {} });

    const userInDm = requestAuthRegister('temp@gmail.com', 'temp', 'temp', 'temp');
    const uId = getId(userInDm.returnObj.token);

    const tempUser = requestAuthRegister('abcd@gmail.com', 'temp1', 'temp1', 'temp1');
    requestDmCreate(tempUser.returnObj.token, [uId]);

    const result = requestUserStatsV1(token);
    expect(result.status).toBe(OK);
    expect(result.returnObj).toStrictEqual({

      channelsJoined: [{ numChannelsJoined: 0, timeStamp: currTime }],
      dmsJoined: [{ numDmsJoined: 0, timeStamp: currTime }],
      messagesSent: [{ numMessagesSent: 0, timeStamp: currTime }],
      involvementRate: 0
    });
  });

  test('leaving a channel case', () => {
    const userInDm = requestAuthRegister('temp@gmail.com', 'temp', 'temp', 'temp');
    const uId = getId(userInDm.returnObj.token);
    const dm = requestDmCreate(token, [uId]);
    requestMessageSendDmV2(token, dm.returnObj.dmId, 'hello');

    requestMessageSendV2(token, channelId, 'how are you?');

    requestChannelLeaveV2(token, channelId);

    const result = requestUserStatsV1(token);
    expect(result.status).toBe(OK);
    expect(result.returnObj).toStrictEqual({

      channelsJoined: [{ numChannelsJoined: 0, timeStamp: currTime }],
      dmsJoined: [{ numDmsJoined: 1, timeStamp: currTime }],
      messagesSent: [{ numMessagesSent: 2, timeStamp: currTime }],
      involvementRate: (1 + 2) / (1 + 1 + 2)
    });
  });
});

describe('Tests for /users/stats/v1', () => {
  let user: {status: number, returnObj: {token: string, authUserId: number}};
  let channel: {status: number, returnObj: {channelId: number}};
  let token: string;
  let channelId: number;
  beforeEach(() => {
    user = requestAuthRegister('ali@gmail.com', 'football', 'ali', 'ahmed');
    channel = requestChannelsCreateV3(user.returnObj.token, 'validName', true);
    token = user.returnObj.token;
    channelId = channel.returnObj.channelId;
  });

  test('invalid token', () => {
    try {
      const result = requestUsersStatsV1(token + 'a');
      expect(result.status).toBe(AUTHORIZATION_ERROR);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('only channels exist success case', () => {
    const result = requestUserStatsV1(token);
    expect(result.status).toBe(OK);
    expect(result.returnObj).toStrictEqual({

      channelsExist: [{ numChannelsExist: 1, timeStamp: currTime }],
      dmsExist: [{ numDmsExist: 0, timeStamp: currTime }],
      messagesExist: [{ numMessagesExist: 0, timeStamp: currTime }],
      utilizationRate: (1 / 1)
    });
  });

  test('message exists success case', () => {
    requestMessageSendV2(token, channelId, 'i am sleepy');
    const result = requestUserStatsV1(token);
    expect(result.status).toBe(OK);
    expect(result.returnObj).toStrictEqual({

      channelsExist: [{ numChannelsExist: 1, timeStamp: currTime }],
      dmsExist: [{ numDmsExist: 0, timeStamp: currTime }],
      messagesExist: [{ numMessagesExist: 1, timeStamp: currTime }],
      utilizationRate: (1 / 1)
    });
  });

  test('dm exists success case', () => {
    const userInDm = requestAuthRegister('temp@gmail.com', 'temp', 'temp', 'temp');
    const uId = getId(userInDm.returnObj.token);
    const dm = requestDmCreate(token, [uId]);
    requestMessageSendDmV2(token, dm.returnObj.dmId, 'hello');

    const result = requestUserStatsV1(token);
    expect(result.status).toBe(OK);
    expect(result.returnObj).toStrictEqual({

      channelsExist: [{ numChannelsExist: 1, timeStamp: currTime }],
      dmsExist: [{ numDmsExist: 1, timeStamp: currTime }],
      messagesExist: [{ numMessagesExist: 1, timeStamp: currTime }],
      utilizationRate: (2 / 2)
    });
  });

  test('0 utilizationRate', () => {
    const userInDm = requestAuthRegister('temp@gmail.com', 'temp', 'temp', 'temp');
    const uId = getId(userInDm.returnObj.token);
    const dm = requestDmCreate(token, [uId]);
    requestMessageSendDmV2(token, dm.returnObj.dmId, 'hello');

    requestChannelLeaveV2(token, channelId);

    const result = requestUserStatsV1(token);
    expect(result.status).toBe(OK);
    expect(result.returnObj).toStrictEqual({

      channelsExist: [{ numChannelsExist: 1, timeStamp: currTime }],
      dmsExist: [{ numDmsExist: 1, timeStamp: currTime }],
      messagesExist: [{ numMessagesExist: 0, timeStamp: currTime }],
      utilizationRate: 0
    });
  });

  test('dm + channel + messages case', () => {
    const userInDm = requestAuthRegister('temp@gmail.com', 'temp', 'temp', 'temp');
    const uId = getId(userInDm.returnObj.token);
    const dm = requestDmCreate(token, [uId]);
    requestMessageSendDmV2(token, dm.returnObj.dmId, 'hello');
    requestMessageSendV2(token, channelId, 'i am sleepy');

    const result = requestUserStatsV1(token);
    expect(result.status).toBe(OK);
    expect(result.returnObj).toStrictEqual({

      channelsExist: [{ numChannelsExist: 1, timeStamp: currTime }],
      dmsExist: [{ numDmsExist: 1, timeStamp: currTime }],
      messagesExist: [{ numMessagesExist: 2, timeStamp: currTime }],
      utilizationRate: (1 + 1 / 1 + 1)
    });
  });
});
