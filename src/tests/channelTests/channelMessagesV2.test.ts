import request from "sync-request";
import config from "../../config.json";
import { clearV1 } from "../../other";
import { requestAuthRegister } from "../authRequesters";
import { requestChannelMessagesV3 } from "../channelRequestor";
const OK = 200;
const port = config.port;
const url = config.url;
const SERVER_URL = `${url}:${port}`;
import { resetData } from "../../dataStore";
let user1Token: string;
let user2Token: string;
let channel1Id: number;

beforeEach(() => {
    resetData();
    clearV1();
    const user1data = requestAuthRegister(
        "user1@hotmail.com",
        "p123445P",
        "Arr",
        "Sddd"
    );
    user1Token = user1data.returnObj.token;
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
    // make a user2
    const user2data = requestAuthRegister(
        "user2@hotmail.com",
        "p123445P",
        "ddddddd",
        "Sddddd"
    );
    user2Token = user2data.returnObj.token;
});

describe("channelMessages", () => {
    test("Success case - channelMessages", () => {
        const res = requestChannelMessagesV3(user1Token, channel1Id, 0);
        expect(res.returnObj).toStrictEqual({
            messages: [],
            start: 0,
            end: -1,
        });
        expect(res.status).toBe(OK);
    });

    test("Invalid ChannelId", () => {
        const res = requestChannelMessagesV3(user1Token, channel1Id + 1, 0);
        expect(res.status).toBe(400);
    });
    test("start too big", () => {
        const res = requestChannelMessagesV3(user1Token, channel1Id, 300000);
        expect(res.status).toBe(400);
    });
    test("Invalid user", () => {
        const res = requestChannelMessagesV3(user2Token, channel1Id, 0);
        expect(res.status).toBe(403);
    });
    test("Invalid token", () => {
        const res = requestChannelMessagesV3("abcdefg", channel1Id, 0);
        expect(res.status).toBe(403);
    });
});
