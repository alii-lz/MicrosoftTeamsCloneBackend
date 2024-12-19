import request from "sync-request";

import { port, url } from "../../config.json";
const SERVER_URL = `${url}:${port}`;
const OK = 200;

const ERROR = { error: expect.any(String) };

beforeEach(() => {
    request("DELETE", SERVER_URL + "/clear/v1", { json: {} });
});

describe("tests for /users/all/v1", () => {
    let user: { token: string; authUserId: number };
    let user2: { token: string; authUserId: number };

    beforeEach(() => {
        const tempUser = request("POST", SERVER_URL + "/auth/register/v3", {
            json: {
                email: "matthew@gmail.com",
                password: "validPassword",
                nameFirst: "matthew",
                nameLast: "ieong",
            },
        });

        user = JSON.parse(tempUser.getBody() as string);

        const tempUser2 = request("POST", SERVER_URL + "/auth/register/v3", {
            json: {
                email: "ali@gmail.com",
                password: "validPassword2",
                nameFirst: "ali",
                nameLast: "amend",
            },
        });

        user2 = JSON.parse(tempUser2.getBody() as string);
    });

    test("success case", () => {
        const res = request("GET", SERVER_URL + "/users/all/v2", {
            headers: { token: user.token },
        });

        const data = JSON.parse(res.getBody() as string);

        expect(res.statusCode).toBe(OK);
        expect(data).toStrictEqual({
            users: [
                {
                    uId: user.authUserId,
                    email: "matthew@gmail.com",
                    nameFirst: "matthew",
                    nameLast: "ieong",
                    handleStr: "matthewieong",
                },
                {
                    uId: user2.authUserId,
                    email: "ali@gmail.com",
                    nameFirst: "ali",
                    nameLast: "amend",
                    handleStr: "aliamend",
                },
            ],
        });
    });

    test("invalid token", () => {
        try {
            const res = request("GET", SERVER_URL + "/users/all/v2", {
                headers: { token: "invalid" },
            });

            const data = JSON.parse(res.getBody() as string);

            expect(res.statusCode).toBe(403);
            expect(data.error).toStrictEqual(ERROR);
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
        }
    });
});
