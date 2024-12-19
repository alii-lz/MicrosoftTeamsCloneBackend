import request from "sync-request";

import { port, url } from "../../config.json";
const SERVER_URL = `${url}:${port}`;
const OK = 200;

const ERROR = { error: expect.any(String) };
let user: { token: string; authUserId: number };
let user2: { token: string; authUserId: number };
let owner2: { token: string; authUserId: number };
let notOwner: { token: string; authUserId: number };
let notOwner2: { token: string; authUserId: number };
let channel: { channelId: number };
let channel2: { channelId: number };
beforeEach(() => {
    request("DELETE", SERVER_URL + "/clear/v1", { json: {} });
});
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

    const tempUser50 = request("POST", SERVER_URL + "/auth/register/v3", {
        json: {
            email: "ali2d@gmail.com",
            password: "validPassword2",
            nameFirst: "also",
            nameLast: "owner",
        },
    });
    owner2 = JSON.parse(tempUser50.getBody() as string);

    const tempChannel = request("POST", SERVER_URL + "/channels/create/v3", {
        headers: {
            token: user.token,
        },
        json: {
            name: "matthew",
            isPublic: true,
        },
    });
    channel = JSON.parse(tempChannel.getBody() as string);

    const tempChannel2 = request("POST", SERVER_URL + "/channels/create/v3", {
        headers: {
            token: user.token,
        },
        json: {
            name: "second",
            isPublic: true,
        },
    });
    channel2 = JSON.parse(tempChannel2.getBody() as string);
    // Invite the person -- Arden Sae-Ueng
    request("POST", SERVER_URL + "/channel/invite/v3", {
        headers: {
            token: user.token,
        },
        json: {
            channelId: channel.channelId,
            uId: owner2.authUserId,
        },
    });

    request("POST", SERVER_URL + "/channel/addowner/v2", {
        headers: {
            token: user.token,
        },
        json: {
            channelId: channel.channelId,
            uId: owner2.authUserId,
        },
    });
});
// Need to add an owner for success case to work -- Arden Sae-Ueng
describe("tests for /channel/removeowner/v2", () => {
    test("success case", () => {
        const res = request("POST", SERVER_URL + "/channel/removeowner/v2", {
            headers: {
                token: user.token,
            },
            json: {
                channelId: channel.channelId,
                uId: owner2.authUserId,
            },
        });

        const data = JSON.parse(res.getBody() as string);

        expect(res.statusCode).toBe(OK);
        expect(data).toEqual({});
    });

    test("channelId does not refer to a valid channel", () => {
        try {
            const res = request(
                "POST",
                SERVER_URL + "/channel/removeowner/v2",
                {
                    headers: {
                        token: user.token,
                    },
                    json: {
                        channelId: channel.channelId + 1,
                        uId: user2.authUserId,
                    },
                }
            );

            const data = JSON.parse(res.getBody() as string);

            expect(res.statusCode).toBe(400);
            expect(data).toStrictEqual(ERROR);
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
        }
    });

    test("uId does not refer to a valid user", () => {
        try {
            const res = request(
                "POST",
                SERVER_URL + "/channel/removeowner/v2",
                {
                    headers: {
                        token: user.token,
                    },
                    json: {
                        channelId: channel.channelId,
                        uId: user2.authUserId + 5,
                    },
                }
            );

            const data = JSON.parse(res.getBody() as string);

            expect(res.statusCode).toBe(400);
            expect(data).toStrictEqual(ERROR);
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
        }
    });

    test("uId refers to a user who is not an owner of the channel", () => {
        const tempUser3 = request("POST", SERVER_URL + "/auth/register/v3", {
            json: {
                email: "tony@gmail.com",
                password: "validPassword3",
                nameFirst: "tony",
                nameLast: "stark",
            },
        });

        notOwner = JSON.parse(tempUser3.getBody() as string);

        try {
            const res = request(
                "POST",
                SERVER_URL + "/channel/removeowner/v2",
                {
                    headers: {
                        token: user.token,
                    },
                    json: {
                        channelId: channel.channelId,
                        uId: notOwner.authUserId,
                    },
                }
            );

            const data = JSON.parse(res.getBody() as string);

            expect(res.statusCode).toBe(400);
            expect(data).toStrictEqual(ERROR);
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
        }
    });

    test("uId refers to a user who is currently the only owner of the channel", () => {
        try {
            const res = request(
                "POST",
                SERVER_URL + "/channel/removeowner/v2",
                {
                    headers: {
                        token: user.token,
                    },
                    json: {
                        channelId: channel2.channelId,
                        uId: user.authUserId,
                    },
                }
            );

            const data = JSON.parse(res.getBody() as string);

            expect(res.statusCode).toBe(400);
            expect(data).toStrictEqual(ERROR);
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
        }
    });

    test("channelId is valid and the authorised user does not have owner permissions in the channel", () => {
        const tempUser4 = request("POST", SERVER_URL + "/auth/register/v3", {
            json: {
                email: "danny@gmail.com",
                password: "validPassword4",
                nameFirst: "danny",
                nameLast: "chen",
            },
        });

        notOwner2 = JSON.parse(tempUser4.getBody() as string);

        try {
            const res = request(
                "POST",
                SERVER_URL + "/channel/removeowner/v2",
                {
                    headers: {
                        token: notOwner2.token,
                    },
                    json: {
                        channelId: channel.channelId,
                        uId: user2.authUserId,
                    },
                }
            );

            const data = JSON.parse(res.getBody() as string);

            expect(res.statusCode).toBe(403);
            expect(data).toEqual(ERROR);
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
        }
    });

    test("token is not valid", () => {
        try {
            const res = request(
                "POST",
                SERVER_URL + "/channel/removeowner/v2",
                {
                    headers: {
                        token: "RANDOM",
                    },
                    json: {
                        channelId: channel.channelId,
                        uId: user2.authUserId,
                    },
                }
            );

            const data = JSON.parse(res.getBody() as string);

            expect(res.statusCode).toBe(403);
            expect(data).toEqual(ERROR);
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
        }
    });
});
