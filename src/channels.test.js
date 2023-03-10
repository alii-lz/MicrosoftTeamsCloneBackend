import {channelsCreateV1, channelsListV1, channelsListAllV1}  from './channels.js';

import {authRegisterV1, authLoginV1} from './auth.js';
import { ClearV1 } from './other.js';
import { getData } from './dataStore.js';


const ERROR = { error: expect.any(String) };

beforeEach(() => {
  ClearV1();
}); 

describe('All tests for channelsCreateV1', () => {

  test('Empty channel name', () => {
    expect(channelsCreateV1(1, '', true)).toStrictEqual(ERROR);
  });

  test('Channel name more than 20 characters', () => {
    expect(channelsCreateV1(1, 'qwertyuioplkjhgfdsazx', true)).toStrictEqual(ERROR);
  });

  test('Invalid authUserId', () => {
    const user = authRegisterV1('validemail@gmail.com', '123abc!@#', 'Jake', 'Renzella');
    expect(channelsCreateV1(user.authUserId + 1, 'validChannel', true)).toStrictEqual(ERROR);
  });

  test('Correct return type', () => {
    const user = authRegisterV1('validemail@gmail.com', '123abc!@#', 'Jake', 'Renzella');
    expect(channelsCreateV1(user.authUserId, 'validChannel', true)).toStrictEqual({channelId: expect.any(Number)});
  });

});


describe('All tests for channelsListV1', () => {

  test('Invalid authUserId', () => {
    const result = authRegisterV1('validemail@gmail.com', '123abc!@#', 'Jake', 'Renzella');
    expect(channelsListV1(result.authUserId + 1)).toStrictEqual(ERROR);
  });

  test('Correct return type', () => {
    const user1 = authRegisterV1('validemail@gmail.com', '123abc!@#', 'Jake', 'Renzella');
    const channel1 = channelsCreateV1(user1.authUserId, 'channel1', true);

    expect(channelsListV1(user1.authUserId)).toStrictEqual({
      channels: [
        {
          channelId: channel1.channelId,
          name: 'channel1',
        }
      ]
    });
  });

});


describe('All tests for channelsListAllV1', () => {

  test('Empty authUserId', () => {
    expect(channelsListAllV1('')).toEqual(ERROR);
  });

  test('Invalid authUserId', () => {
    const result = authRegisterV1('validemail@gmail.com', '123abc!@#', 'Jake', 'Renzella');
    expect(channelsListAllV1(result.authUserId + 1)).toEqual(ERROR); 
  });

  test('Correct return type', () => {
    const user1 = authRegisterV1('validemail@gmail.com', '123abc!@#', 'Jake', 'Renzella');
    const channel1 = channelsCreateV1(user1.authUserId, 'channel1', true);
    const channel2 = channelsCreateV1(user1.authUserId, 'channel2', false);
    const channel3 = channelsCreateV1(user1.authUserId, 'channel3', true);
    
    expect(channelsListAllV1(user1.authUserId)).toEqual({
      channels: [
        {
          channelId: channel1.channelId,
          name: 'channel1',
        },
        {
          channelId: channel2.channelId,
          name: 'channel2',
        },
        {
          channelId: channel3.channelId,
          name: 'channel3',
        }
      ],
    });
  });
});