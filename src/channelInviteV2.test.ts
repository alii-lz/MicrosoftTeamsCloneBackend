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

let user1Token: string;
let user1Id: number;
let user2Token: string;
let user2Id: number;
let channel1Id: number;
beforeEach(() => {
  clearV1();
  // Make the first User
  const user1 = request(
    'POST',
    SERVER_URL + '/auth/register/v3',
    {
      json: {
        email: 'user1@hotmail.com',
        password: 'p123445P',
        nameFirst: 'asdasdasd',
        nameLast: 'asdadsdsd',
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
        nameFirst: 'Bdsdsdsd',
        nameLast: 'Sdsdsdssdsd',
      }
    }
  );
  const user2data = JSON.parse(user2.getBody() as string);
  user2Token = user2data.token;
  user2Id = user2data.authUserId;
});

describe('channelInvite', () => {
  test('Success case - channelInvite', () => {
    const res = request(
      'POST',
      SERVER_URL + '/channel/invite/v3',
      {
        headers: {
          token: user1Token,
        },
        json: {
          // token: user1Token,
          channelId: channel1Id,
          uId: user2Id,
        }
      }
    );
    const returnData = JSON.parse(res.getBody() as string);
    expect(returnData).toStrictEqual({});
    expect(res.statusCode).toBe(OK);
  });

  test('Invalid channelId', () => {
    const res = request(
      'POST',
      SERVER_URL + '/channel/invite/v3',
      {
        headers: {
          token: user1Token,
        },
        json: {
          // token: user1Token,
          channelId: channel1Id + 1,
          uId: user2Id,
        }
      }
    );
    const returnData = JSON.parse(res.body as string);
    // expect(returnData).toStrictEqual({ error: 'Please enter valid channelId.' });
    expect(res.statusCode).toBe(400);
  });
  test('Invalid uId', () => {
    const res = request(
      'POST',
      SERVER_URL + '/channel/invite/v3',
      {
        headers: {
          token: user1Token,
        },
        json: {
          // token: user1Token,
          channelId: channel1Id,
          uId: user2Id + 22,
        }
      }
    );
    const returnData = JSON.parse(res.body as string);
    // expect(returnData).toStrictEqual({ error: 'Invalid uId.' });
    expect(res.statusCode).toBe(400);
  });
  test('uId already member', () => {
    const res = request(
      'POST',
      SERVER_URL + '/channel/invite/v3',
      {
        headers: {
          token: user1Token,
        },
        json: {
          // token: user1Token,
          channelId: channel1Id,
          uId: user1Id,
        }
      }
    );
    const returnData = JSON.parse(res.body as string);
    // expect(returnData).toStrictEqual({ error: 'Member already in channel.' });
    expect(res.statusCode).toBe(403);
  });
  test('Authorised user not a member', () => {
    const res = request(
      'POST',
      SERVER_URL + '/channel/invite/v3',
      {
        headers: {
          token: user2Token,
        },
        json: {
          // token: user2Token,
          channelId: channel1Id,
          uId: user2Id,
        }
      }
    );
    const returnData = JSON.parse(res.body as string);
    // expect(returnData).toStrictEqual({ error: 'You are not part of this channel.' });
    expect(res.statusCode).toBe(403);
  });
  test('Invalid token', () => {
    const res = request(
      'POST',
      SERVER_URL + '/channel/invite/v3',
      {
        headers: {
          token: 'abcdef',
        },
        json: {
          // token: 'abcdef',
          channelId: channel1Id,
          uId: user2Id,
        }
      }
    );
    const returnData = JSON.parse(res.body as string);
    // expect(returnData).toStrictEqual({ error: 'Invalid token.' });
    expect(res.statusCode).toBe(403);
  });
});
