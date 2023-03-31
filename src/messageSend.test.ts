import request from 'sync-request';
import config from './config.json';

import {
  getData,
} from './dataStore';

import {
  clearV1,
} from './other';

const OK = 200;
const port = config.port;
const url = config.url;
const SERVER_URL = `${url}:${port}`;
const data = getData();

/* These tests will test the http wrappers for the message/ functions.
There will not be not tests for the functions themselves because the http
wrappers will return an error if something is wrong with the functions anyways.
*/
// Start of message/send/v1 tests

describe('messageSendV1', () => {
  let user1Token: string;
  let user1Id: number;
  let user2Token: string;
  let user2Id: number;
  let channel1Id: number;
  beforeEach(() => {
    clearV1();
    const user1 = request(
      'POST',
      SERVER_URL + '/auth/register/v2',
      {
        json: {
          email: 'user1@hotmail.com',
          password: 'p123445P',
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
          password: 'p123445P',
          nameFirst: 'B',
          nameLast: 'S',
        }
      }
    );
    const user2data = JSON.parse(user2.getBody() as string);
    const user2Token = user2data.token;
    const user2Id = user2data.authUserId;
  });

  test('Success case - messageSend', () => {
    let res = request(
      'POST',
      SERVER_URL + '/message/send/v1',
      {
        json: {
          token: user1Token,
          channelId: channel1Id,
          message: 'First message is in channel 1',
        }
      }
    );
    const returnData = JSON.parse(res.getBody() as string);
    expect(returnData).toStrictEqual({ 0: Number });
    expect(res.statusCode).toBe(OK);
    // Check if message is there.
    res = request(
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
    const data = JSON.parse(res.getBody() as string);
    expect(data).toStrictEqual({
      messages: [{
        messageId: 0,
        uId: user1Id,
        message: 'First message is in channel 1',
        timeSent: expect.any(Number),
      }],
      start: 0,
      end: -1
    });
  });

  test('Invalid channelId', () => {
    const res = request(
      'POST',
      SERVER_URL + '/message/send/v1',
      {
        json: {
          token: user1Token,
          channelId: channel1Id + 1,
          message: 'First message is in channel 1',
        }
      }
    );
    const returnData = JSON.parse(res.getBody() as string);
    expect(returnData).toStrictEqual({ error: 'Invalid channelId.' });
    expect(res.statusCode).toBe(OK);
  });

  test('Invalid token', () => {
    const res = request(
      'POST',
      SERVER_URL + '/message/send/v1',
      {
        json: {
          token: 'asbdasd',
          channelId: channel1Id,
          message: 'First message is in channel 1',
        }
      }
    );
    const returnData = JSON.parse(res.getBody() as string);
    expect(returnData).toStrictEqual({ error: 'Invalid token.' });
    expect(res.statusCode).toBe(OK);
  });

  test('valid channel but invalid authuserid', () => {
    const res = request(
      'POST',
      SERVER_URL + '/message/send/v1',
      {
        json: {
          token: user2Token,
          channelId: channel1Id,
          message: 'First message is in channel 1',
        }
      }
    );
    const returnData = JSON.parse(res.getBody() as string);
    expect(returnData).toStrictEqual({ error: 'User is not part of this channel.' });
    expect(res.statusCode).toBe(OK);
  });

  test('message less than one character', () => {
    const res = request(
      'POST',
      SERVER_URL + '/message/send/v1',
      {
        json: {
          token: user1Token,
          channelId: channel1Id,
          message: '',
        }
      }
    );
    const returnData = JSON.parse(res.getBody() as string);
    expect(returnData).toStrictEqual({ error: 'Message too short.' });
    expect(res.statusCode).toBe(OK);
  });

  test('message over 1000 characters', () => {
    const res = request(
      'POST',
      SERVER_URL + '/message/send/v1',
      {
        json: {
          token: user1Token,
          channelId: channel1Id,
          message: 'aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaaa',
        }
      }
    );
    const returnData = JSON.parse(res.getBody() as string);
    expect(returnData).toStrictEqual({ error: 'Message too long.' });
    expect(res.statusCode).toBe(OK);
  });
});
