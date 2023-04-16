// Written by Arden Sae-Ueng
import request from 'sync-request';
import config from './config.json';

import {
  clearV1,
} from './other';

const OK = 200;
const port = config.port;
const url = config.url;
const SERVER_URL = `${url}:${port}`;

/* These tests will test the http wrappers for the message/ functions.
There will not be not tests for the functions themselves because the http
wrappers will return an error if something is wrong with the functions anyways.
*/
// Start of message/send/v2 tests
let user1Token: string;
let user1Id: number;
let user2Token: string;
// let user2Id: number;
let channel1Id: number;
beforeEach(() => {
  clearV1();
  const user1 = request(
    'POST',
    SERVER_URL + '/auth/register/v3',
    {
      json: {
        email: 'user1@hotmail.com',
        password: 'p123445P',
        nameFirst: 'Arr',
        nameLast: 'Sddd',
      }
    }
  );
  const user1data = JSON.parse(user1.getBody() as string);
  user1Token = user1data.token;
  user1Id = user1data.authUserId;
  // make a channel
  const channel1 = request(
    'POST',
    SERVER_URL + '/channels/create/v3',
    {
      headers: {
        token: user1Token,
      },
      json: {
        // token: user1Token,
        name: 'Channel1',
        isPublic: true,
      }
    }
  );
  const channel1data = JSON.parse(channel1.getBody() as string);
  channel1Id = channel1data.channelId;
  // make a user2
  const user2 = request(
    'POST',
    SERVER_URL + '/auth/register/v3',
    {
      json: {
        email: 'user2@hotmail.com',
        password: 'p123445P',
        nameFirst: 'ddddddd',
        nameLast: 'Sddddd',
      }
    }
  );
  const user2data = JSON.parse(user2.getBody() as string);
  user2Token = user2data.token;
  // user2Id = user2data.authUserId;
});

describe('messageSendV1', () => {
  test('Success case - messageSend', () => {
    let res = request(
      'POST',
      SERVER_URL + '/message/send/v2',
      {
        headers: {
          token: user1Token,
        },
        json: {
          // token: user1Token,
          channelId: channel1Id,
          message: 'First message is in channel 1',
        }
      }
    );
    const returnData = JSON.parse(res.getBody() as string);
    expect(returnData).toStrictEqual({ messageId: 0 });
    expect(res.statusCode).toBe(OK);
    // Check if message is there.
    res = request(
      'GET',
      SERVER_URL + '/channel/messages/v3',
      {
        headers: {
          token: user1Token,
        },
        qs: {
          // token: user1Token,
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
      SERVER_URL + '/message/send/v2',
      {
        headers: {
          token: user1Token,
        },
        json: {
          // token: user1Token,
          channelId: channel1Id + 1,
          message: 'First message is in channel 1',
        }
      }
    );
    const returnData = JSON.parse(res.body as string);
    // expect(returnData).toStrictEqual({ error: 'Invalid channelId.' });
    expect(res.statusCode).toBe(400);
  });

  test('Invalid token', () => {
    const res = request(
      'POST',
      SERVER_URL + '/message/send/v2',
      {
        headers: {
          token: 'asbdasd',
        },
        json: {
          // token: 'asbdasd',
          channelId: channel1Id,
          message: 'First message is in channel 1',
        }
      }
    );
    const returnData = JSON.parse(res.body as string);
    // expect(returnData.returnObj).toStrictEqual( 'Invalid token.' );
    expect(res.statusCode).toBe(403);
  });

  test('valid channel but invalid authuserid', () => {
    const res = request(
      'POST',
      SERVER_URL + '/message/send/v2',
      {
        headers: {
          token: user2Token,
        },
        json: {
          // token: user2Token,
          channelId: channel1Id,
          message: 'First message is in channel 1',
        }
      }
    );
    const returnData = JSON.parse(res.body as string);
    // expect(returnData).toStrictEqual({ error: 'User is not part of this channel.' });
    expect(res.statusCode).toBe(403);
  });

  test('message less than one character', () => {
    const res = request(
      'POST',
      SERVER_URL + '/message/send/v2',
      {
        headers: {
          token: user1Token,
        },
        json: {
          // token: user1Token,
          channelId: channel1Id,
          message: '',
        }
      }
    );
    const returnData = JSON.parse(res.body as string);
    // expect(returnData).toStrictEqual({ error: 'Message too short.' });
    expect(res.statusCode).toBe(400);
  });

  test('message over 1000 characters', () => {
    const res = request(
      'POST',
      SERVER_URL + '/message/send/v2',
      {
        headers: {
          token: user1Token,
        },
        json: {
          // token: user1Token,
          channelId: channel1Id,
          message: 'aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaaa',
        }
      }
    );
    const returnData = JSON.parse(res.body as string);
    // expect(returnData).toStrictEqual({ error: 'Message too long.' });
    expect(res.statusCode).toBe(400);
  });
});
