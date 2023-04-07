// Written by Arden Sae-Ueng
import request from 'sync-request';
import config from './config.json';

import {
    getData,
} from './dataStore'

import {
  clearV1,
} from './other';

import { isPrefixUnaryExpression } from 'typescript';
import { token } from 'morgan';

const OK = 200;
const port = config.port;
const url = config.url;
const SERVER_URL = `${url}:${port}`;
const data = getData();

/* These tests will test the http wrappers for the message/ functions. 
There will not be not tests for the functions themselves because the http
wrappers will return an error if something is wrong with the functions anyways. 
*/
// Start of message/remove/v1 tests

describe('messageRemoveV1', () => {
  let user1Token: string;
  let user1Id: number;
  let user2Token: string;
  let user2Id: number;
  let channel1Id: number;
  let messageId: number;
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
    )
    const user2data = JSON.parse(user2.getBody() as string);
    let user2Token = user2data.token;
    let user2Id = user2data.authUserId
    // Make a message. 
    const message0 = request(
      'POST',
      SERVER_URL + '/message/send/v1',
      {
        json: {
          token: user1Token,
          channelId: channel1Id,
          message: "First message is in channel 1",
        }
      }
    )
    messageId = JSON.parse(message0.getBody() as string);
  });

  test('Success case - MessageRemove', () => {
      let res = request(
      'DELETE',
      SERVER_URL + '/message/remove/v1',
      {
        qs: {
          token: user1Token,
          messageId: channel1Id,
        }
      }
    );
    const returnData = JSON.parse(res.getBody() as string);
    expect(returnData).toStrictEqual({});
    expect(res.statusCode).toBe(OK);
    // Check if message is DELETED. 
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
    )
    const data = JSON.parse(res.getBody() as string);
    expect(data).toStrictEqual({messages: [{
    }],
    start: 0,
    end: -1,});
    })

   test('Invalid messageId', () => {
    const res = request(
      'DELETE',
      SERVER_URL + '/message/remove/v1',
      {
        qs: {
          token: user1Token,
          messageId: 10,
        }
      }
      );
    const returnData = JSON.parse(res.getBody() as string);
    expect(returnData).toStrictEqual({ error: 'Invalid messageId.'});
    expect(res.statusCode).toBe(OK);
   })
  
   test('Invalid token', () => {
    const res = request(
      'DELETE',
      SERVER_URL + '/message/remove/v1',
      {
        qs: {
          token: 'asdasdss',
          messageId: messageId,
        }
      }
      );
    const returnData = JSON.parse(res.getBody() as string);
    expect(returnData).toStrictEqual({ error: 'Invalid token.'});
    expect(res.statusCode).toBe(OK);
   })

   test('valid messageId but authuserid not part of channel', () => {
    const res = request(
      'DELETE',
      SERVER_URL + '/message/remove/v1',
      {
        qs: {
          token: user2Token,
          messageId: messageId,
        }
      }
      );
    const returnData = JSON.parse(res.getBody() as string);
    expect(returnData).toStrictEqual({ error: 'User is not a global owner. Cannot remove message.'});
    expect(res.statusCode).toBe(OK);
   })

   test('Global Owner deleting other messages', () => {
    request(
      'POST',
      SERVER_URL + '/channel/invite/v2',
      {
        json: {
          token: user1Token,
          channelId: channel1Id,
          uId: user2Id,
        }
      }
    )
    const nonOwnerComment = request(
      'POST',
      SERVER_URL + '/message/send/v1',
      {
        json: {
          token: user2Token,
          channelId: channel1Id,
          message: "I am not an owner.",
        }
      }
    )
    let nonOwnerCommentId = JSON.parse(nonOwnerComment.getBody() as string);
    const res = request(
      'DELETE',
      SERVER_URL + '/message/remove/v1',
      {
        qs: {
          token: user1Token,
          messageId: nonOwnerCommentId,
        }
      }
      );
    const returnData = JSON.parse(res.getBody() as string);
    expect(returnData).toStrictEqual({});
    expect(res.statusCode).toBe(OK);
    let res2 = request(
      'GET',
      SERVER_URL + '/channel/messages/v2',
      {
        qs: {
          token: user1Token,
          channelId: channel1Id,
          start: 0,
        }
      }
    )
    const data = JSON.parse(res2.getBody() as string);
    expect(data).toStrictEqual({messages: [{
      messageId: 0,
      uId: user1Id,
      message: "First message is in channel 1",
      timeSent: expect.any(Number),
    }],
    start: 0,
    end: -1,});
   })
})
