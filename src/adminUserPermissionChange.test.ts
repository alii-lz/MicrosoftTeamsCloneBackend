// Written By Arden Sae-Ueng
import request from 'sync-request';
import config from './config.json';
import { resetData } from './dataStore';
import { requestAuthRegister } from './authRequesters';
import { requestChannelInviteV3 } from './channelRequestor';
import { requestAdminUserPermissionChangeV1 } from './adminUserRequestors';

const MAX = 22;
const OK = 200;
const port = config.port;
const url = config.url;
const SERVER_URL = `${url}:${port}`;

let user1Token: string;
let user2Token: string;
let user1Id: number;
let user2Id: number;
let channel1Id: number;

beforeEach(() => {
  resetData();
  // User 1
  const user1data = requestAuthRegister('user1@hotmail.com', 'p123445P', 'asd', 'qwerty');
  user1Token = user1data.returnObj.token;
  user1Id = user1data.returnObj.authUserId;
  // User 2
  const user2data = requestAuthRegister('user2@hotmail.com', 'p123445P', 'SecondGuy', 'Sddd');
  user2Token = user2data.returnObj.token;
  user2Id = user2data.returnObj.authUserId;
});

describe('admin/user/removeV1', ()=> {
  test('invalid token', ()=> {
    const res = requestAdminUserPermissionChangeV1('ahhhh', user2Id, 1);
    expect(res.status).toBe(403);
  });

  test('AuthUser not a global owner', ()=> {
    const res = requestAdminUserPermissionChangeV1(user2Token, user2Id, 2);
    expect(res.status).toBe(403);
  });

  test('Invalid uId', ()=> {
    const res = requestAdminUserPermissionChangeV1(user1Token, 100000, 1);
    expect(res.status).toBe(400);
  });

  test('Removing the only global owner', ()=> {
    const res = requestAdminUserPermissionChangeV1(user1Token, user1Id, 2);
    expect(res.status).toBe(400);
  });

  test('Already have that permission', ()=> {
    const res = requestAdminUserPermissionChangeV1(user1Token, user1Id, 1);
    expect(res.status).toBe(400);
  });
  test('Success', ()=> {
    const res = requestAdminUserPermissionChangeV1(user1Token, user2Id, 1);
    expect(res.status).toBe(OK);
  })
})