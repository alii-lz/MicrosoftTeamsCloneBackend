import {authLoginV1} from './auth';
import {authRegisterV1} from './auth';
import {clearV1} from './auth';

test('Test Case 1: Successful Login ', ()=>{
    clearV1();
    const registeredUser = authRegisterV1('rudie@gmail.com', 'soccer7');
    const loginUser = authLoginV1('rudie@gmail.com','soccer7');

    expect(registeredUser).toStrictlyEqual(loginUser);
});

test('Test Case 2: Unsuccessful Login : Invalid Email ', ()=>{
    clearV1();
    authRegisterV1('rudie@gmail.com', 'soccer7');
    const loginUser = authLoginV1('rudie07@gmail.com','soccer7');

    expect(loginUser).toStrictlyEqual({error:'error'});
});

test('Test Case 3: Unsuccessful Login : Invalid Password ', ()=>{
    clearV1();
    authRegisterV1('rudie@gmail.com', 'soccer7');
    const loginUser = authLoginV1('rudie@gmail.com','Soccer7');

    expect(loginUser).toStrictlyEqual({error:'error'});
});

