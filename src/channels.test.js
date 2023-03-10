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