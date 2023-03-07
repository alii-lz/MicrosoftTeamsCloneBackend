import {channelsListAllV1} from './channels.js';
import {authRegisterV1, authLoginV1} from './auth.js';

const ERROR = { error: expect.any(String) };

describe('All tests for channelsListAllV1', () => {
  test('Empty authUserId', () => {
    expect(channelsListAllV1('')).toStrictEqual(ERROR);
  });

  test('Invalid authUserId', () => {
    const result = authRegisterV1('validemail@gmail.com', '123abc!@#', 'Jake', 'Renzella');
    expect(channelsListAllV1(result.authUserId + 1)).toStrictEqual(ERROR);
  });

  test('Correct return type', () => {
    const user1 = authRegisterV1('validemail@gmail.com', '123abc!@#', 'Jake', 'Renzella');
    const channel1 = channelsCreateV1(user1.authUserId, 'channel1', false);

    expect(channelsListAllV1(user1.authUserId)).toStrictEqual({
      channels: [
        {
          channelId: channel1.channelId,
          name: 'channel1',
        }
      ]
    });
  });
});