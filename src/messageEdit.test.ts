import request from 'sync-request';
import config from './config.json';

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

/* These tests will test the http wrappers for the message/ functions. 
There will not be not tests for the functions themselves because the http
wrappers will return an error if something is wrong with the functions anyways. 
*/
// Start of message/edit/v1 tests

describe('messageEditV1', () => {
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

  test('Success case - messageEdit', () => {
      let res = request(
      'PUT',
      SERVER_URL + '/message/edit/v1',
      {
        json: {
          token: user1Token,
          messageId: 0,
          message: "Edited message from channel 1",
        }
      }
      );
    const returnData = JSON.parse(res.getBody() as string);
    expect(returnData).toStrictEqual({});
    expect(res.statusCode).toBe(OK);
    // Check if message is edited. 
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
      messageId: 0,
      uId: user1Id,
      message: "Edited message from channel 1",
      timeSent: expect.any(Number),
    }],
    start: 0,
    end: -1,});
    })

   test('Invalid messageId', () => {
    const res = request(
      'PUT',
      SERVER_URL + '/message/edit/v1',
      {
        json: {
          token: user1Token,
          messageId: 10,
          message: "Edited message from channel 1",
        }
      }
      );
    const returnData = JSON.parse(res.getBody() as string);
    expect(returnData).toStrictEqual({ error: 'Invalid messageId.'});
    expect(res.statusCode).toBe(OK);
   })
  
   test('Invalid token', () => {
    const res = request(
      'PUT',
      SERVER_URL + '/message/edit/v1',
      {
        json: {
          token: 'asdasdss',
          messageId: messageId,
          message: "Edited message from channel 1",
        }
      }
      );
    const returnData = JSON.parse(res.getBody() as string);
    expect(returnData).toStrictEqual({ error: 'Invalid token.'});
    expect(res.statusCode).toBe(OK);
   })

   test('valid messageId but invalid authuserid', () => {
    const res = request(
      'PUT',
      SERVER_URL + '/message/edit/v1',
      {
        json: {
          token: user2Token,
          messageId: messageId,
          message: "Edited message from channel 1",
        }
      }
      );
    const returnData = JSON.parse(res.getBody() as string);
    expect(returnData).toStrictEqual({ error: 'User is not a global owner. Cannot edit message.'});
    expect(res.statusCode).toBe(OK);
   })

   test('message less than one character', () => {
    const res = request(
      'PUT',
      SERVER_URL + '/message/edit/v1',
      {
        json: {
          token: user1Token,
          messageId: messageId,
          message: "",
        }
      }
      );
    const returnData = JSON.parse(res.getBody() as string);
    expect(returnData).toStrictEqual({});
    expect(res.statusCode).toBe(OK);
    // Message should be unedited.
    request(
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
      messageId: 0,
      uId: user1Id,
      message: "First message is in channel 1",
      timeSent: expect.any(Number),
    }],
    start: 0,
    end: -1,});
    })

  test('message over 1000 characters', () => {
    const res = request(
      'PUT',
      SERVER_URL + '/message/edit/v1',
      {
        json: {
          token: user1Token,
          messageId: messageId,
          message: "aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaaa",
        }
      }
      );
    const returnData = JSON.parse(res.getBody() as string);
    expect(returnData).toStrictEqual({ error: 'Message too long.'});
    expect(res.statusCode).toBe(OK);
   })
})
