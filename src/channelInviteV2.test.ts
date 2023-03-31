import request from 'sync-request';
import config from './config.json';
const ERROR = { error: expect.any(String) };
import {
    getData,
} from './dataStore'

import {
  clearV1,
} from './other';

const OK = 200;
const port = config.port;
const url = config.url;
const SERVER_URL = `${url}:${port}`;

const data = getData();

describe('channelInvite', () => {
  let user1Token: string;
  let user1Id: number;
  let user2Token: string;
  let user2Id: number;
  let channel1Id: number;
  beforeEach(() => {
    clearV1();
    //////////////Make the first User    
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
    )
    const user1data = JSON.parse(user1.getBody() as string);
    let user1Token = user1data.token;
    let user1Id = user1data.authUserId;
    //make a channel
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
    )
    const channel1data = JSON.parse(channel1.getBody() as string);
    let channel1Id = channel1data.channelId;
    //make a user2
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
    )
    const user2data = JSON.parse(user2.getBody() as string);
    let user2Token = user2data.token;
    let user2Id = user2data.authUserId
    
  });

  test('Success case - channelInvite', () => {
      const res = request(
      'POST',
      SERVER_URL + '/channel/invite/v2',
      {
        json: {
          token: user1Token,
          channelId: channel1Id,
          uId: user2Id,
        }
      }
      );
    const returnData = JSON.parse(res.getBody() as string);
    expect(returnData).toStrictEqual({});
    expect(res.statusCode).toBe(OK);
    //check if uId is part of channel.
    let finalCheck = false;
    if (data.channels[0].allMembers.includes(user2Id) == true) {
      finalCheck = true;
    }
    expect(finalCheck).toStrictEqual(true);
    })

   test('Invalid channelId', () => {
    const res = request(
      'POST',
      SERVER_URL + '/channel/invite/v2',
      {
        json: {
          token: user1Token,
          channelId: channel1Id + 1,
          uId: user2Id,
        }
      }
      );
    const returnData = JSON.parse(res.getBody() as string);
    expect(returnData).toStrictEqual({ error: 'Please enter valid channelId.'});
    expect(res.statusCode).toBe(OK);
   })
   test('Invalid uId', () => {
    const res = request(
      'POST',
      SERVER_URL + '/channel/invite/v2',
      {
        json: {
          token: user1Token,
          channelId: channel1Id,
          uId: user2Id +22,
        }
      }
      );
    const returnData = JSON.parse(res.getBody() as string);
    expect(returnData).toStrictEqual({ error: 'Invalid uId.'});
    expect(res.statusCode).toBe(OK);
   })
   test('uId already member', () => {
    const res = request(
      'POST',
      SERVER_URL + '/channel/invite/v2',
      {
        json: {
          token: user1Token,
          channelId: channel1Id,
          uId: user1Id,
        }
      }
      );
    const returnData = JSON.parse(res.getBody() as string);
    expect(returnData).toStrictEqual({ error: 'Member already in channel.'});
    expect(res.statusCode).toBe(OK);
   })
   test('Authorised user not a member', () => {
    const res = request(
      'POST',
      SERVER_URL + '/channel/invite/v2',
      {
        json: {
          token: user2Token,
          channelId: channel1Id,
          uId: user2Id,
        }
      }
      );
    const returnData = JSON.parse(res.getBody() as string);
    expect(returnData).toStrictEqual({ error: 'You are not part of this channel.'});
    expect(res.statusCode).toBe(OK);
   })
   test('Invalid token', () => {
    const res = request(
      'POST',
      SERVER_URL + '/channel/invite/v2',
      {
        json: {
          token: 'abcdef',
          channelId: channel1Id,
          uId: user2Id,
        }
      }
      );
    const returnData = JSON.parse(res.getBody() as string);
    expect(returnData).toStrictEqual({ ERROR });
    expect(res.statusCode).toBe(OK);
   })
})
