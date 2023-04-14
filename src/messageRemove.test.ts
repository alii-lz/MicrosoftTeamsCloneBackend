// Written by Arden Sae-Ueng
import request from 'sync-request';
import config from './config.json';
import { requestAuthRegister } from './authRequesters';
import { channelInviteV3, channelMessagesV3 } from './channelRequestor';
import { requestMessageSendV2, requestMessageRemoveV2 } from './messageFunctionRequestors'
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
// Start of message/remove/v2 tests
let user1Token: string;
let user1Id: number;
let user2Token: string;
let user2Id: number;
let channel1Id: number;
let messageIdPass: any;
let messageId: number;
let messageId2Pass: any;
let messageId2: number;
beforeEach(() => {
  clearV1();
  const user1data = requestAuthRegister('user1@hotmail.com', 'p123445P', 'Arr', 'Sddd');
  user1Token= user1data.returnObj.token;
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
        name: 'Channel1',
        isPublic: true,
      }
    }
  );
  const channel1data = JSON.parse(channel1.getBody() as string);
  channel1Id = channel1data.channelId;

  const user2data = requestAuthRegister('user2@hotmail.com', 'p123445P', 'ddddddd', 'Sddddd');
  user2Token= user2data.returnObj.token;
  user2Id = user2data.returnObj.authUserId;

  const message0 = requestMessageSendV2(user1Token,channel1Id,'First message is in channel 1')
  messageId = message0.returnObj.messageId;
  channelInviteV3(user1Token, channel1Id, user2Id)
  const nonOwnerComment = requestMessageSendV2(user2Token,channel1Id,'I am not an owner.')
  messageId2 = nonOwnerComment.returnObj.messageId;
});

describe('messageRemoveV1', () => {
  test('Success case - MessageRemove', () => {
    const res = requestMessageRemoveV2(user1Token,messageId)
    expect(res.returnObj).toStrictEqual({});
    expect(res.status).toBe(OK);
    const res2 = channelMessagesV3(user1Token,channel1Id,0)
    expect(res2.returnObj).toStrictEqual({
      messages: [
        {
          message: 'I am not an owner.',
          messageId: 1,
          timeSent: expect.any(Number),
          uId: 2,
          isPinned: false,
          reacts:[],
        }
      ],
      start: 0,
      end: -1,
    });
  });

  test('Invalid messageId', () => {
    const res = requestMessageRemoveV2(user1Token,10)
    expect(res.status).toBe(400);
  });

  test('Invalid token', () => {
    const res = requestMessageRemoveV2('asdasdss',messageId)
    expect(res.status).toBe(403);
  });

  test('valid messageId but authuserid not part of channel', () => {
    const res = requestMessageRemoveV2(user2Token,messageId)
    expect(res.status).toBe(403);
  });
});

describe('Last test', () => {
  test('Global Owner deleting other messages', () => {
    const res = requestMessageRemoveV2(user1Token,messageId2)
    expect(res.returnObj).toStrictEqual({});
    expect(res.status).toBe(OK);
    const res2 = channelMessagesV3(user1Token,channel1Id,0)
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
});
