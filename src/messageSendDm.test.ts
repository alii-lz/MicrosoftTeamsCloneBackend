// Written by Arden Sae-Ueng
import request from 'sync-request';
import config from './config.json';
import { requestAuthRegister, requestAuthLogin, requestAuthLogout } from './authRequesters';
import { requestMessageSendDmV2 } from './messageFunctionRequestors'
import { requestDmCreate } from './dmRequesters';
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

let user1Token: string;
let user2Token: string;
let user2Id: number;
let user4Token: string;
let dmIdJSON: any;
let dmId: number;
beforeEach(() => {
  clearV1();
  const user1data = requestAuthRegister('user1@hotmail.com', 'p123445P', 'Arr', 'Sddd');
  user1Token= user1data.returnObj.token;
  const user4data = requestAuthRegister('user4@hotmail.com', 'p123445P', 'A', 'S');
  user4Token= user4data.returnObj.token;
  const user2data = requestAuthRegister('user2@hotmail.com', 'p123445P', 'B', 'S');
  user2Token= user2data.returnObj.token;
  user2Id = user2data.returnObj.authUserId;
  const dm1 = requestDmCreate(user1Token, [user2Id])
  dmId = dm1.returnObj.dmId;
});

describe('messageSendDM', () => {
  test('Success case - senddm', () => {
    const res = requestMessageSendDmV2(user1Token, dmId, 'DM MESSAGE 1')
    expect(res.returnObj).toStrictEqual({ messageId: 0 });
    expect(res.status).toBe(OK);
  });
  test('Invalid dmId', () => {
    const res = requestMessageSendDmV2(user1Token, dmId+1, 'DM MESSAGE 1')
    expect(res.status).toBe(400);
  });

  test('Invalid token', () => {
    const res = requestMessageSendDmV2('bois', dmId, 'DM MESSAGE 1')
    expect(res.status).toBe(403);
  });

  test('valid dm but invalid authuserid', () => {
    const res = requestMessageSendDmV2(user4Token, dmId, 'Wharever')
    expect(res.status).toBe(403);
  });

  test('message less than one character', () => {
    const res = requestMessageSendDmV2(user2Token, dmId, '')
    expect(res.status).toBe(400);
  });

  test('message over 1000 characters', () => {
    const res = requestMessageSendDmV2(user2Token, dmId, 'aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaaa')
    expect(res.status).toBe(400);
  });
});
