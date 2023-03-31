import request from 'sync-request';
import config from './config.json';
const ERROR = { error: expect.any(String) };
import {
  getData,
} from './dataStore';

const OK = 200;
const port = config.port;
const url = config.url;
const SERVER_URL = `${url}:${port}`;

const data = getData();

describe('channelInvite', () => {
  /// /////////////Make the first User
  const user1 = request(
    'POST',
    SERVER_URL + '/auth/register/v2',
    {
      json: {
        email: 'user1@hotmail.com',
        password: 'p1',
        nameFirst: 'A',
        nameLast: 'S',
      }
    }
  );
  const user1data = JSON.parse(user1.getBody() as string);
  const user1Token = user1data.token;
  const user1Id = user1data.authUserId;
  // make a channel
  const channel1 = request(
    'POST',
    SERVER_URL + '/channels/create/v2',
    {
      json: {
        token: user1Token,
        name: 'Channel1',
        isPublic: true,
      }
    }
  );
  const channel1data = JSON.parse(channel1.getBody() as string);
  const channel1Id = channel1data.channelId;
  // make a user2
  const user2 = request(
    'POST',
    SERVER_URL + '/auth/register/v2',
    {
      json: {
        email: 'user2@hotmail.com',
        password: 'p2',
        nameFirst: 'B',
        nameLast: 'S',
      }
    }
  );
  const user2data = JSON.parse(user2.getBody() as string);
  const user2Token = user2data.token;
  const user2Id = user2data.authUserId;
  /// //////////////////////////////////////Actual Test
  test('Success case - channelMessages', () => {
    const res = request(
      'GET',
      SERVER_URL + '/channel/messages/v2',
      {
        qs: {
          token: user1Token,
          channelId: channel1Id,
          start: 0,
        }
      }
    );
    const returnData = JSON.parse(res.getBody() as string);
    expect(returnData).toStrictEqual({
      messages: [
      ],
      start: 0,
      end: -1
    });
    expect(res.statusCode).toBe(OK);
  });

  test('Invalid ChannelId', () => {
    const res = request(
      'GET',
      SERVER_URL + '/channel/messages/v2',
      {
        qs: {
          token: user1Token,
          channelId: channel1Id + 1,
          start: 0,
        }
      }
    );
    const returnData = JSON.parse(res.getBody() as string);
    expect(returnData).toStrictEqual({ error: 'Please enter valid channelId.' });
    expect(res.statusCode).toBe(OK);
  });
  test('start too big', () => {
    const res = request(
      'GET',
      SERVER_URL + '/channel/messages/v2',
      {
        qs: {
          token: user1Token,
          channelId: channel1Id,
          start: 30000,
        }
      }
    );
    const returnData = JSON.parse(res.getBody() as string);
    expect(returnData).toStrictEqual({ error: 'Message number entered exceeds the number of messages in this channel.' });
    expect(res.statusCode).toBe(OK);
  });
  test('Invalid user', () => {
    const res = request(
      'GET',
      SERVER_URL + '/channel/messages/v2',
      {
        qs: {
          token: user1Token + 1,
          channelId: channel1Id,
          start: 0,
        }
      }
    );
    const returnData = JSON.parse(res.getBody() as string);
    expect(returnData).toStrictEqual({ error: 'User not part of channel.' });
    expect(res.statusCode).toBe(OK);
  });
  test('Invalid token', () => {
    const res = request(
      'GET',
      SERVER_URL + '/channel/messages/v2',
      {
        qs: {
          token: 'abcdefg',
          channelId: channel1Id,
          start: 0,
        }
      }
    );
    const returnData = JSON.parse(res.getBody() as string);
    expect(returnData).toStrictEqual({ ERROR });
    expect(res.statusCode).toBe(OK);
  });
});
