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
// Start of message/senddm/v2 tests
let user1Token: string;
// let user1Id: number;
let user2Token: string;
let user2Id: number;
// let user3Token: string;
// let user3Id: number;
let user4Token: string;
// let user4Id: number;
// let channel1Id: number;
let dmIdJSON: any;
let dmId: number;
beforeEach(() => {
  clearV1();
  const user1 = request(
    'POST',
    SERVER_URL + '/auth/register/v3',
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
  user1Token = user1data.token;
  // user1Id = user1data.authUserId;
  const user4 = request(
    'POST',
    SERVER_URL + '/auth/register/v3',
    {
      json: {
        email: 'user4@hotmail.com',
        password: 'p123445P',
        nameFirst: 'A',
        nameLast: 'S',
      }
    }
  );
  const user4data = JSON.parse(user4.getBody() as string);
  user4Token = user4data.token;
  // user4Id = user4data.authUserId;
  // make a channel
  // const channel1 = request(
  //   'POST',
  //   SERVER_URL + '/channels/create/v2',
  //   {
  //     json: {
  //       token: user1Token,
  //       name: 'Channel1',
  //       isPublic: true,
  //     }
  //   }
  // );
  // const channel1data = JSON.parse(channel1.getBody() as string);
  // channel1Id = channel1data.channelId;
  // make a user2
  const user2 = request(
    'POST',
    SERVER_URL + '/auth/register/v3',
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
  user2Token = user2data.token;
  user2Id = user2data.authUserId;
  // const user3 = request(
  //   'POST',
  //   SERVER_URL + '/auth/register/v3',
  //   {
  //     json: {
  //       email: 'user3@hotmail.com',
  //       password: 'p123445P',
  //       nameFirst: 'B',
  //       nameLast: 'S',
  //     }
  //   }
  // );
  // const user3data = JSON.parse(user3.getBody() as string);
  // user3Token = user3data.token;
  // user3Id = user3data.authUserId;
  const dm1 = request(
    'POST',
    SERVER_URL + '/dm/create/v1',
    {
      headers: {
        token: user1Token,
      },
      json: {
        // token: user1Token,
        uIds: [user2Id],
      }
    }
  );
  dmIdJSON = JSON.parse(dm1.getBody() as string);
  dmId = dmIdJSON.dmId;
});

describe('messageSendDM', () => {
  test('Success case - senddm', () => {
    const res = request(
      'POST',
      SERVER_URL + '/message/senddm/v2',
      {
        headers: {
          token: user1Token,
        },
        json: {
          // token: user1Token,
          dmId: dmId,
          message: 'DM MESSAGE 1',
        }
      }
    );

    const returnData = JSON.parse(res.getBody() as string);
    expect(returnData).toStrictEqual({ messageId: 0 });
    expect(res.statusCode).toBe(OK);
  });
  test('Invalid dmId', () => {
    const res = request(
      'POST',
      SERVER_URL + '/message/senddm/v2',
      {
        headers: {
          token: user1Token,
        },
        json: {
          // token: user1Token,
          dmId: dmId + 1,
          message: 'DM MESSAGE 1'
        }
      }
    );
    const returnData = JSON.parse(res.body as string);
    // expect(returnData).toStrictEqual({ error: 'Invalid dmId.' });
    expect(res.statusCode).toBe(400);
  });

  test('Invalid token', () => {
    const res = request(
      'POST',
      SERVER_URL + '/message/senddm/v2',
      {
        headers: {
          token: 'bois',
        },
        json: {
          // token: 'bois',
          dmId: dmId,
          message: 'DM MESSAGE 1'
        }
      }
    );
    const returnData = JSON.parse(res.body as string);
    // expect(returnData).toStrictEqual({ error: 'Invalid token.' });
    expect(res.statusCode).toBe(403);
  });

  test('valid dm but invalid authuserid', () => {
    const res = request(
      'POST',
      SERVER_URL + '/message/senddm/v2',
      {
        headers: {
          token: user4Token,
        },
        json: {
          // token: user4Token,
          dmId: dmId,
          message: 'Wharever',
        }
      }
    );
    const returnData = JSON.parse(res.body as string);
    // expect(returnData).toStrictEqual({ error: 'User is not part of DM.' });
    expect(res.statusCode).toBe(403);
  });

  test('message less than one character', () => {
    const res = request(
      'POST',
      SERVER_URL + '/message/senddm/v2',
      {
        headers: {
          token: user2Token,
        },
        json: {
          // token: user2Token,
          dmId: dmId,
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
      SERVER_URL + '/message/senddm/v2',
      {
        headers: {
          token: user2Token,
        },
        json: {
          // token: user2Token,
          dmId: dmId,
          message: 'aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaaa',
        }
      }
    );
    const returnData = JSON.parse(res.body as string);
    // expect(returnData).toStrictEqual({ error: 'Message too long.' });
    expect(res.statusCode).toBe(400);
  });
});
