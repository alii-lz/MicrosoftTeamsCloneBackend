import { requestProfileSetnameV2 } from "../profileRequesters";
import { requestAuthRegister } from "../authRequesters";
import { requestClear } from "../clearRequester";
const OK = 200;
const INPUT_ERROR = 400;

// Initalize AuthUserIds
let AuthUserId1: { token: string; authUserId: number };

describe("user/profile/setname/v2 failure testCases", () => {
    beforeEach(() => {
        requestClear();
        const AuthUserId1_return = requestAuthRegister(
            "harry.potter@gmail.com",
            "quidditch",
            "Harry",
            "Potter"
        );
        AuthUserId1 = AuthUserId1_return.returnObj;
    });

    test("Test 1: Undefined token", () => {
        try {
            const result = requestProfileSetnameV2(null, "Harvey", "Plotter");
            expect(result.returnObj.error).toEqual({
                error: expect.any(String),
            });
            expect(result.status).toBe(INPUT_ERROR);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    });

    test("Test 2: Undefined first name", () => {
        try {
            const result = requestProfileSetnameV2(
                AuthUserId1.token,
                null,
                "Plotter"
            );
            expect(result.returnObj.error).toEqual({
                error: expect.any(String),
            });
            expect(result.status).toBe(INPUT_ERROR);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    });

    test("Test 3: Undefined last name", () => {
        try {
            const result = requestProfileSetnameV2(
                AuthUserId1.token,
                "Harvey",
                null
            );
            expect(result.returnObj.error).toEqual({
                error: expect.any(String),
            });
            expect(result.status).toBe(INPUT_ERROR);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    });

    test("Test 4: Invalid token", () => {
        try {
            const result = requestProfileSetnameV2("-1", "Harvey", "Plotter");
            expect(result.returnObj.error).toEqual({
                error: expect.any(String),
            });
            expect(result.status).toBe(INPUT_ERROR);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    });

    test("Test 5: long first name", () => {
        try {
            const result = requestProfileSetnameV2(
                AuthUserId1.token,
                "Harveyfdsjapiofjjiupdefjapjdfiupasueuipashhuidfsasdasdasd",
                "Plotter"
            );
            expect(result.returnObj.error).toEqual({
                error: expect.any(String),
            });
            expect(result.status).toBe(INPUT_ERROR);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    });

    test("Test 6: long last name", () => {
        try {
            const result = requestProfileSetnameV2(
                AuthUserId1.token,
                "Harvey",
                "Plotterdfsafdsafijdsnahfinewafdohbewaydholfauewbfaudos"
            );
            expect(result.returnObj.error).toEqual({
                error: expect.any(String),
            });
            expect(result.status).toBe(INPUT_ERROR);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    });
});

describe("user/profile/setname/v2 success testCases", () => {
    beforeEach(() => {
        requestClear();
        const AuthUserId1_return = requestAuthRegister(
            "harry.potter@gmail.com",
            "quidditch",
            "Harry",
            "Potter"
        );
        AuthUserId1 = AuthUserId1_return.returnObj;
    });

    test("Test 1: Success first-last name change", () => {
        const result = requestProfileSetnameV2(
            AuthUserId1.token,
            "Harvey",
            "Plotter"
        );
        expect(result.returnObj).toStrictEqual({});
        expect(result.status).toBe(OK);
    });

    test("Test 2: Success first name change", () => {
        const result = requestProfileSetnameV2(
            AuthUserId1.token,
            "Ronnie",
            "Weasley"
        );
        expect(result.returnObj).toStrictEqual({});
        expect(result.status).toBe(OK);
    });
});
