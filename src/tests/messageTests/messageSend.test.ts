import request from "sync-request";
import config from "../../config.json";
import { requestAuthRegister } from "../authRequesters";
import { requestMessageSendV2 } from "../messageFunctionRequestors";
import { clearV1 } from "../../other";
import { resetData } from "../../dataStore";

const OK = 200;
const port = config.port;
const url = config.url;
const SERVER_URL = `${url}:${port}`;

/* These tests will test the http wrappers for the message/ functions.
There will not be not tests for the functions themselves because the http
wrappers will return an error if something is wrong with the functions anyways.
*/
// Start of message/send/v2 tests
let user1Token: string;
let user1Id: number;
let user2Token: string;
let channel1Id: number;
beforeEach(() => {
    resetData();
    clearV1();
    // Make user 1
    const user1data = requestAuthRegister(
        "user1@hotmail.com",
        "p123445P",
        "Arr",
        "Sddd"
    );
    user1Token = user1data.returnObj.token;
    user1Id = user1data.returnObj.authUserId;
    // make a channel
    const channel1 = request("POST", SERVER_URL + "/channels/create/v3", {
        headers: {
            token: user1Token,
        },
        json: {
            name: "Channel1",
            isPublic: true,
        },
    });
    const channel1data = JSON.parse(channel1.getBody() as string);
    channel1Id = channel1data.channelId;
    // Make second user
    const user2data = requestAuthRegister(
        "user2@hotmail.com",
        "p123445P",
        "ddddddd",
        "Sddddd"
    );
    user2Token = user2data.returnObj.token;
});

describe("messageSendV1", () => {
    test("Success case - messageSend", () => {
        const channel1 = requestMessageSendV2(
            user1Token,
            channel1Id,
            "First message is in channel 1"
        );
        expect(channel1.returnObj).toStrictEqual({ messageId: 0 });
        expect(channel1.status).toBe(OK);
        // Check if message is there.
        const res = request("GET", SERVER_URL + "/channel/messages/v3", {
            headers: {
                token: user1Token,
            },
            qs: {
                channelId: channel1Id,
                start: 0,
            },
        });
        const data = JSON.parse(res.getBody() as string);
        expect(data).toStrictEqual({
            messages: [
                {
                    messageId: 0,
                    uId: user1Id,
                    message: "First message is in channel 1",
                    timeSent: expect.any(Number),
                    isPinned: false,
                    reacts: [],
                },
            ],
            start: 0,
            end: -1,
        });
    });

    test("Invalid channelId", () => {
        const channel1 = requestMessageSendV2(
            user1Token,
            channel1Id + 1,
            "First message is in channel 1"
        );
        expect(channel1.status).toBe(400);
    });

    test("Invalid token", () => {
        const channel1 = requestMessageSendV2(
            "asbdasd",
            channel1Id,
            "First message is in channel 1"
        );
        expect(channel1.status).toBe(403);
    });

    test("valid channel but invalid authuserid", () => {
        const channel1 = requestMessageSendV2(
            user2Token,
            channel1Id,
            "First message is in channel 1"
        );
        expect(channel1.status).toBe(403);
    });

    test("message less than one character", () => {
        const channel1 = requestMessageSendV2(user1Token, channel1Id, "");
        expect(channel1.status).toBe(400);
    });

    test("message over 1000 characters", () => {
        const channel1 = requestMessageSendV2(
            user1Token,
            channel1Id,
            "aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaaa"
        );
        expect(channel1.status).toBe(400);
    });
});
