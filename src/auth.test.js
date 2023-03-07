import { authRegisterV1 } from './auth';
import { authLoginV1 } from './auth';
import { clearV1 } from './other';

    test('Test Case 1: Correct registration: Success', () => {
        clearV1();
        const result = authRegisterV1('rudie@gmail.com', 'soccer7', 'Rudie', 'Tate');
        userId = result.authUserId
        expect(userId).toEqual(expect.any(Number));

    });


    test('Test Case 2: Registered email being used: Error', () => {
        clearV1();
        authRegisterV1('rudie@gmail.com', 'soccer7', 'Rudie', 'Tate');
        const result = authRegisterV1('rudie@gmail.com', 'soccer', 'Rudie', 'Maria');

        expect(result).toHaveProperty('error');

    });

    test('Test Case 3: Invalid email: Error', () => {
        clearV1();
        const result = authRegisterV1('rudie.com', 'soccer7', 'Rudie', 'Tate');

        expect(result).toHaveProperty('error');

    });



    test('Test Case 4: Invalid length of last name: Error', () => {
        clearV1();
        const result = authRegisterV1('rudie@gmail.com', 'soccer7', 'Rudie', '');

        expect(result).toHaveProperty('error');

    });

    
    test('Test Case 5: Invalid length of first name: Error', () => {
        clearV1();
        const result = authRegisterV1('rudie@gmail.com', 'soccer7', '', 'Tate');


        expect(result).toHaveProperty('error');

    });

    test('Test Case 6: Short password: Error', () => {
        clearV1();
        const result = authRegisterV1('rudiea@gmail.com', 'soc', 'Rudie', 'Tate');

        expect(result).toHaveProperty('error');

    });
    