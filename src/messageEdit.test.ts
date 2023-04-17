// Written by Arden Sae-Ueng
import request from 'sync-request';
import config from './config.json';
import { requestAuthRegister } from './authRequesters';
import { requestChannelMessagesV3 } from './channelRequestor';
import { requestMessageSendV2, requestMessageEditV2 } from './messageFunctionRequestors';
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
// Start of message/edit/v1 tests
let user1Token: string;
let user1Id: number;
let user2Token: string;
// let user2Id: number;
let channel1Id: number;
let m1: any;
let messageId: number;
beforeEach(() => {
  clearV1();
  const user1data = requestAuthRegister('user1@hotmail.com', 'p123445P', 'Arr', 'Sddd');
  user1Token = user1data.returnObj.token;
  user1Id = user1data.returnObj.authUserId;
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

  const user2data = requestAuthRegister('user2@hotmail.com', 'p123445P', 'ddddddd', 'Sddddd');
  user2Token = user2data.returnObj.token;
  const m1 = requestMessageSendV2(user1Token, channel1Id, 'First message is in channel 1');
  messageId = m1.returnObj.messageId;
});

describe('messageEditV1', () => {
  test('Success case - messageEdit', () => {
    const res = requestMessageEditV2(user1Token, 0, 'Edited message from channel 1');
    expect(res.returnObj).toStrictEqual({});
    expect(res.status).toBe(OK);
    // Check if message is edited.
    const res2 = requestChannelMessagesV3(user1Token, channel1Id, 0);
    expect(res2.returnObj).toStrictEqual({
      messages: [{
        messageId: 0,
        uId: user1Id,
        message: 'Edited message from channel 1',
        timeSent: expect.any(Number),
        isPinned: false,
        reacts: [],
      }],
      start: 0,
      end: -1,
    });
  });

  test('Invalid messageId', () => {
    const res = requestMessageEditV2(user1Token, 10, 'Edited message from channel 1');
    expect(res.status).toBe(400);
  });

  test('Invalid token', () => {
    const res = requestMessageEditV2('asdasdss', messageId, 'Edited message from channel 1');
    expect(res.status).toBe(403);
  });

  test('valid messageId but invalid authuserid', () => {
    const res = requestMessageEditV2(user2Token, messageId, 'Edited message from channel 1');
    expect(res.status).toBe(403);
  });

  test('message less than one character', () => {
    const res = requestMessageEditV2(user1Token, messageId, '');
    expect(res.returnObj).toStrictEqual({});
    expect(res.status).toBe(OK);
    // Message should be unedited.
    const res2 = requestChannelMessagesV3(user1Token, channel1Id, 0);
    expect(res2.returnObj).toStrictEqual({
      messages: [{
        messageId: 0,
        uId: user1Id,
        message: 'First message is in channel 1',
        timeSent: expect.any(Number),
        isPinned: false,
        reacts: [],
      }],
      start: 0,
      end: -1,
    });
  });

  test('message over 1000 characters', () => {
    const res = requestMessageEditV2(user1Token, messageId, 'aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaaa');
    expect(res.status).toBe(400);
  });
});
