import request from "sync-request";
import { port, url } from "../../config.json";
import { requestChannelsCreateV3 } from "../channelsRequestor";
import {
    requestStandupStartV1,
    requestStandupActiveV1,
    requestStandupSendV1,
} from "../standupRequestor";
const SERVER_URL = `${url}:${port}`;
const OK = 200;
const INPUT_ERROR = 400;
const AUTHORIZATION_ERROR = 403;
const ERROR = { error: expect.any(String) };

beforeEach(() => {
    request("DELETE", SERVER_URL + "/clear/v1", { json: {} });
});

function requestAuthRegister(
    email: string,
    password: string,
    nameFirst: string,
    nameLast: string
) {
    const res = request("POST", SERVER_URL + "/auth/register/v3", {
        json: {
            email: email,
            password: password,
            nameFirst: nameFirst,
            nameLast: nameLast,
        },
        timeout: 100,
    });
    return {
        status: res.statusCode,
        returnObj: JSON.parse(res.body as string),
    };
}

describe("Tests for /standup/start/v1", () => {
    let user: {
        status: number;
        returnObj: { token: string; authUserId: number };
    };
    let channel: { status: number; returnObj: { channelId: number } };
    beforeEach(() => {
        user = requestAuthRegister("ali@gmail.com", "football", "ali", "ahmed");
        channel = requestChannelsCreateV3(
            user.returnObj.token,
            "validName",
            true
        );
    });

    test("success case", () => {
        const result = requestStandupStartV1(
            user.returnObj.token,
            channel.returnObj.channelId,
            2
        );

        expect(result.status).toBe(OK);
        expect(result.returnObj).toStrictEqual({
            timeFinish: Math.floor(new Date().getTime() / 1000),
        });
    });

    test("channelId does not refer to a valid channel", () => {
        try {
            const result = requestStandupStartV1(
                user.returnObj.token,
                channel.returnObj.channelId + 1,
                2
            );
            expect(result.status).toBe(INPUT_ERROR);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    });

    test("active standup is already running in the channel", () => {
        try {
            const activeStandup = requestStandupStartV1(
                user.returnObj.token,
                channel.returnObj.channelId,
                3
            );
            const result = requestStandupStartV1(
                user.returnObj.token,
                channel.returnObj.channelId,
                2
            );
            expect(result.status).toBe(INPUT_ERROR);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    });

    test("user not a member of channel", () => {
        try {
            const notMember = requestAuthRegister(
                "temp@gmail.com",
                "football",
                "temp",
                "temp"
            );
            const result = requestStandupStartV1(
                notMember.returnObj.token,
                channel.returnObj.channelId,
                2
            );
            expect(result.status).toBe(AUTHORIZATION_ERROR);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    });

    test("invalid token", () => {
        try {
            const result = requestStandupActiveV1(
                user.returnObj.token + "a",
                channel.returnObj.channelId
            );
            expect(result.status).toBe(AUTHORIZATION_ERROR);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    });
});

describe("Tests for /standup/active/v1", () => {
    let user: {
        status: number;
        returnObj: { token: string; authUserId: number };
    };
    let channel: { status: number; returnObj: { channelId: number } };
    let standup: { status: number; returnObj: { timeFinish: number } };
    beforeEach(() => {
        user = requestAuthRegister("ali@gmail.com", "football", "ali", "ahmed");
        channel = requestChannelsCreateV3(
            user.returnObj.token,
            "validName",
            true
        );
        standup = requestStandupStartV1(
            user.returnObj.token,
            channel.returnObj.channelId,
            4
        );
    });

    test("success case", () => {
        const result = requestStandupActiveV1(
            user.returnObj.token,
            channel.returnObj.channelId
        );

        expect(result.status).toBe(OK);
        expect(result.returnObj.isActive).toStrictEqual(true);
        expect(result.returnObj.timeFinish).toStrictEqual(
            Math.floor(new Date().getTime() / 1000) + 4
        );
    });

    test("channelId does not refer to a valid channel", () => {
        try {
            const result = requestStandupActiveV1(
                user.returnObj.token,
                channel.returnObj.channelId + 1
            );
            expect(result.status).toBe(INPUT_ERROR);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    });

    test("user not a member of channel", () => {
        try {
            const notMember = requestAuthRegister(
                "temp@gmail.com",
                "football",
                "temp",
                "temp"
            );

            const result = requestStandupActiveV1(
                notMember.returnObj.token,
                channel.returnObj.channelId
            );
            expect(result.status).toBe(AUTHORIZATION_ERROR);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    });

    test("invalid token", () => {
        try {
            const result = requestStandupActiveV1(
                user.returnObj.token + "a",
                channel.returnObj.channelId
            );
            expect(result.status).toBe(AUTHORIZATION_ERROR);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    });
});

describe("Tests for /standup/send/v1", () => {
    let user: {
        status: number;
        returnObj: { token: string; authUserId: number };
    };
    let channel: { status: number; returnObj: { channelId: number } };
    beforeEach(() => {
        user = requestAuthRegister("ali@gmail.com", "football", "ali", "ahmed");
        channel = requestChannelsCreateV3(
            user.returnObj.token,
            "validName",
            true
        );
    });

    test("success case", () => {
        let standup: { status: number; returnObj: { timeFinish: number } };
        standup = requestStandupStartV1(
            user.returnObj.token,
            channel.returnObj.channelId,
            4
        );

        const result = requestStandupSendV1(
            user.returnObj.token,
            channel.returnObj.channelId,
            "hello"
        );

        expect(result.status).toBe(OK);
        expect(result.returnObj).toStrictEqual({});
    });

    test("channelId does not refer to a valid channel", () => {
        try {
            let standup: { status: number; returnObj: { timeFinish: number } };
            standup = requestStandupStartV1(
                user.returnObj.token,
                channel.returnObj.channelId,
                4
            );
            const result = requestStandupSendV1(
                user.returnObj.token,
                channel.returnObj.channelId + 1,
                "hello"
            );
            expect(result.status).toBe(INPUT_ERROR);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    });

    test("length of message is over 1000 characters", () => {
        try {
            let standup: { status: number; returnObj: { timeFinish: number } };
            standup = requestStandupStartV1(
                user.returnObj.token,
                channel.returnObj.channelId,
                4
            );
            const message = "X".repeat(1001);
            const result = requestStandupSendV1(
                user.returnObj.token,
                channel.returnObj.channelId,
                message
            );
            expect(result.status).toBe(INPUT_ERROR);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    });

    test("an active standup is not currently running in the channel", () => {
        try {
            const result = requestStandupSendV1(
                user.returnObj.token,
                channel.returnObj.channelId,
                "hello"
            );
            expect(result.status).toBe(AUTHORIZATION_ERROR);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    });

    test("invalid token", () => {
        try {
            let standup: { status: number; returnObj: { timeFinish: number } };
            standup = requestStandupStartV1(
                user.returnObj.token,
                channel.returnObj.channelId,
                4
            );
            const result = requestStandupSendV1(
                user.returnObj.token + "a",
                channel.returnObj.channelId,
                "hello"
            );
            expect(result.status).toBe(AUTHORIZATION_ERROR);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    });
});
