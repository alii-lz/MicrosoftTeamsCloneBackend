import {channelsCreateV1}  from 'channels.js';

const ERROR = { error: expect.any(String) };

describe('Checking input error cases for channelsCreateV1', () => {
  test('Empty channel name', () => {
    expect(channelsCreateV1(1, '', true)).toStrictEqual({ERROR});
  });

  test('Channel name more than 20 characters', () => {
    expect(channelsCreateV1(1, 'qwertyuioplkjhgfdsazx', true)).toStrictEqual({ERROR});
  });

  test('Invalid authUserId', () => {
    const result = authRegisterV1('validemail@gmail.com', '123abc!@#', 'Jake', 'Renzella');

    expect(channelsCreateV1(result.authUserId + 1, 'validChannel', true)).toStrictEqual({ERROR});
  });
});

describe('Checking valid input for channelsCreateV1', () => {
  
  test('correct input', () => {
    
    const result = authRegisterV1('validemail@gmail.com', '123abc!@#', 'Jake', 'Renzella');
    expect(channelsCreateV1(result.authUserId, 'validChannel', true)).toStrictEqual(expect.any(Number));
  });

});

  