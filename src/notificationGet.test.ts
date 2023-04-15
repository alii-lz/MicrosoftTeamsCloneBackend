// Written By Arden Sae-Ueng
import request from 'sync-request';
import config from './config.json';
import { resetData } from './dataStore';
import { requestAuthRegister } from './authRequesters';
// import { requestChannelsCreateV3 } from './channels.test';
// import { requestDmCreate } from './dmRequesters';
import { requestChannelInviteV3 } from './channelRequestor';
// import { requestMessageSendDmV2, requestMessageSendV2 } from './messageFunctionRequestors';

const MAX = 22;
const OK = 200;
const port = config.port;
const url = config.url;
const SERVER_URL = `${url}:${port}`;
/* 3 types of notifications:
tagging which requires 2 users in 1 channel,
reacted message: user reacting to message,
added to a channel/DM.

Requires
2x users             2x auth user
1x channel           1x channelCreate

lots of channelInvites, reacts and taggs

At the time of writing this function, channel leave does not have a requestor and still v1, tagging and reacting are still being worked on.
To avoid further delays, I will use a loop to create 22x channel create and channel invites which I know work. Only 20 notifications are needed.
*/

let user1Token: string;
let user2Token: string;
let user2Id: number;
const channelIds: number[] = [];
const channeldata: { channelId: number }[] = [];
beforeEach(() => {
  resetData();
  // User 1
  const user1data = requestAuthRegister('user1@hotmail.com', 'p123445P', 'asd', 'qwerty');
  user1Token = user1data.returnObj.token;

  // User 2
  const user2data = requestAuthRegister('user2@hotmail.com', 'p123445P', 'SecondGuy', 'Sddd');
  user2Token = user2data.returnObj.token;
  user2Id = user2data.returnObj.authUserId;
});

/*
Tests are conducted starting with 0 notifications for user 2.
Tests include:
- More than 20 notifications.
- Less than 20 notifications.
- No notificaations.
- Invalid Token
*/

describe('NotificationGet', () => {
  test('More Than 20', () => {
    for (let i = 0; i < MAX; i++) {
      const channel = request(
        'POST',
        SERVER_URL + '/channels/create/v3',
        {
          headers: {
            token: user1Token,
          },
          json: {
            name: `Channel${i}`,
            isPublic: true,
          }
        }
      );
      channeldata[i] = JSON.parse(channel.getBody() as string);
      channelIds[i] = channeldata[i].channelId;
      requestChannelInviteV3(user1Token, channelIds[i], user2Id); // Notification 1
    }
    const notifications = request(
      'GET',
      SERVER_URL + '/notifications/get/v1',
      {
        headers: {
          token: user2Token,
        },
        qs: {
        },
      }
    );
    const result = JSON.parse(notifications.body as string);
    expect(notifications.statusCode).toBe(OK);
    expect(result).toStrictEqual([
      {
        channelId: 22,
        dmId: -1,
        notificationMessage: 'asdqwerty added you to Channel21'
      },
      {
        channelId: 21,
        dmId: -1,
        notificationMessage: 'asdqwerty added you to Channel20'
      },
      {
        channelId: 20,
        dmId: -1,
        notificationMessage: 'asdqwerty added you to Channel19'
      },
      {
        channelId: 19,
        dmId: -1,
        notificationMessage: 'asdqwerty added you to Channel18'
      },
      {
        channelId: 18,
        dmId: -1,
        notificationMessage: 'asdqwerty added you to Channel17'
      },
      {
        channelId: 17,
        dmId: -1,
        notificationMessage: 'asdqwerty added you to Channel16'
      },
      {
        channelId: 16,
        dmId: -1,
        notificationMessage: 'asdqwerty added you to Channel15'
      },
      {
        channelId: 15,
        dmId: -1,
        notificationMessage: 'asdqwerty added you to Channel14'
      },
      {
        channelId: 14,
        dmId: -1,
        notificationMessage: 'asdqwerty added you to Channel13'
      },
      {
        channelId: 13,
        dmId: -1,
        notificationMessage: 'asdqwerty added you to Channel12'
      },
      {
        channelId: 12,
        dmId: -1,
        notificationMessage: 'asdqwerty added you to Channel11'
      },
      {
        channelId: 11,
        dmId: -1,
        notificationMessage: 'asdqwerty added you to Channel10'
      },
      {
        channelId: 10,
        dmId: -1,
        notificationMessage: 'asdqwerty added you to Channel9'
      },
      {
        channelId: 9,
        dmId: -1,
        notificationMessage: 'asdqwerty added you to Channel8'
      },
      {
        channelId: 8,
        dmId: -1,
        notificationMessage: 'asdqwerty added you to Channel7'
      },
      {
        channelId: 7,
        dmId: -1,
        notificationMessage: 'asdqwerty added you to Channel6'
      },
      {
        channelId: 6,
        dmId: -1,
        notificationMessage: 'asdqwerty added you to Channel5'
      },
      {
        channelId: 5,
        dmId: -1,
        notificationMessage: 'asdqwerty added you to Channel4'
      },
      {
        channelId: 4,
        dmId: -1,
        notificationMessage: 'asdqwerty added you to Channel3'
      },
      {
        channelId: 3,
        dmId: -1,
        notificationMessage: 'asdqwerty added you to Channel2'
      },
    ]);
  });

  test('Less Than 20', () => {
    for (let i = 0; i < 5; i++) {
      const channel = request(
        'POST',
        SERVER_URL + '/channels/create/v3',
        {
          headers: {
            token: user1Token,
          },
          json: {
            name: `Channel${i}`,
            isPublic: true,
          }
        }
      );
      channeldata[i] = JSON.parse(channel.getBody() as string);
      channelIds[i] = channeldata[i].channelId;
      requestChannelInviteV3(user1Token, channelIds[i], user2Id); // Notification 1
    }
    const notifications = request(
      'GET',
      SERVER_URL + '/notifications/get/v1',
      {
        headers: {
          token: user2Token,
        },
        qs: {
        },
      }
    );
    const result = JSON.parse(notifications.body as string);
    expect(notifications.statusCode).toBe(OK);
    expect(result).toStrictEqual([
      {
        channelId: 5,
        dmId: -1,
        notificationMessage: 'asdqwerty added you to Channel4'
      },
      {
        channelId: 4,
        dmId: -1,
        notificationMessage: 'asdqwerty added you to Channel3'
      },
      {
        channelId: 3,
        dmId: -1,
        notificationMessage: 'asdqwerty added you to Channel2'
      },
      {
        channelId: 2,
        dmId: -1,
        notificationMessage: 'asdqwerty added you to Channel1'
      },
      {
        channelId: 1,
        dmId: -1,
        notificationMessage: 'asdqwerty added you to Channel0'
      },
    ]);
  });

  test('No notifications', () => {
    const notifications = request(
      'GET',
      SERVER_URL + '/notifications/get/v1',
      {
        headers: {
          token: user2Token,
        },
        qs: {
        },
      }
    );
    const result = JSON.parse(notifications.body as string);
    expect(notifications.statusCode).toBe(OK);
    expect(result).toStrictEqual([]);
  });

  test('Invalid Id', () => {
    const notifications = request(
      'GET',
      SERVER_URL + '/notifications/get/v1',
      {
        headers: {
          token: 'nah',
        },
        qs: {
        },
      }
    );
    expect(notifications.statusCode).toBe(403);
  });
});
