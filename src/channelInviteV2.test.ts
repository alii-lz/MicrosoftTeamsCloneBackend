// Written by Arden Sae-Ueng
import request from 'sync-request';
import config from './config.json';
import { requestAuthRegister } from './authRequesters';
import { requestChannelInviteV3 } from './channelRequestor';
import {
  clearV1,
} from './other';
import { resetData } from './dataStore';

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
  resetData();
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
        name: 'Channel1',
        isPublic: true,
      }
    }
  );
  const channel1data = JSON.parse(channel1.getBody() as string);
  channel1Id = channel1data.channelId;

  const user2data = requestAuthRegister('user2@hotmail.com', 'p123445P', 'ddddddd', 'Sddddd');
  user2Token = user2data.returnObj.token;
  user2Id = user2data.returnObj.authUserId;
});

describe('channelInvite', () => {
  test('Success case - channelInvite', () => {
    const res = requestChannelInviteV3(user1Token, channel1Id, user2Id);
    expect(res.returnObj).toStrictEqual({});
    expect(res.status).toBe(OK);
  });

  test('Invalid channelId', () => {
    const res = requestChannelInviteV3(user1Token, channel1Id + 1, user2Id);
    expect(res.status).toBe(400);
  });
  test('Invalid uId', () => {
    const res = requestChannelInviteV3(user1Token, channel1Id, user2Id + 22);
    expect(res.status).toBe(400);
  });
  test('uId already member', () => {
    const res = requestChannelInviteV3(user1Token, channel1Id, user1Id);
    expect(res.status).toBe(400);
  });
  test('Authorised user not a member', () => {
    const res = requestChannelInviteV3(user2Token, channel1Id, user2Id);
    expect(res.status).toBe(403);
  });
  test('Invalid token', () => {
    const res = requestChannelInviteV3('abcdef', channel1Id, user2Id);
    expect(res.status).toBe(403);
  });
});
