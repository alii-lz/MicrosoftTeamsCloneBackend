import request from "sync-request";

import { port, url } from "../../config.json";
const SERVER_URL = `${url}:${port}`;
const OK = 200;

const ERROR = { error: expect.any(String) };
import { requestDmCreate } from "../dmRequesters";
import { requestClear } from "../clearRequester";
import { requestAuthRegister } from "../authRequesters";
import {
    requestMessageSendV2,
    requestMessageSendDmV2,
} from "../messageFunctionRequestors";

let user: any;
let user2: any;
let userToken: string;
let user2Token: string;
let channel1Id: number;
let dm1Id: number;

beforeEach(() => {
    requestClear();
    user = requestAuthRegister(
        "matthew@gmail.com",
        "validPassword",
        "matthew",
        "ieong"
    ).returnObj;
    userToken = user.token;
    user2 = requestAuthRegister(
        "ali@gmail.com",
        "validPassword2",
        "ali",
        "amend"
    ).returnObj;
    user2Token = user2.token;

    const channel1 = request("POST", SERVER_URL + "/channels/create/v3", {
        headers: {
            token: userToken,
        },
        json: {
            name: "Channel1",
            isPublic: true,
        },
    });
    const channel1data = JSON.parse(channel1.getBody() as string);
    channel1Id = channel1data.channelId;

    const dm1 = requestDmCreate(userToken, [user2.authUserId]).returnObj;
    dm1Id = dm1.dmId;
});

describe("tests for /search/v1", () => {
    test("success case: search for channel/dm message that the user has joined that contain the query", () => {
        const channelMessage = requestMessageSendV2(
            userToken,
            channel1Id,
            "helloStr1"
        ).returnObj;
        const dmMessage = requestMessageSendDmV2(
            userToken,
            dm1Id,
            "helloStr2"
        ).returnObj;

        const search = request("GET", SERVER_URL + "/search/v1", {
            headers: {
                token: userToken,
            },
            qs: {
                queryStr: "hello",
            },
        });
        const searchdata = JSON.parse(search.getBody() as string);

        expect(searchdata).toStrictEqual({
            messages: [
                {
                    messageId: channelMessage.messageId,
                    uId: user.authUserId,
                    message: "helloStr1",
                    timeSent: expect.any(Number),
                    reacts: [],
                    isPinned: false,
                },
                {
                    messageId: dmMessage.messageId,
                    uId: user.authUserId,
                    message: "helloStr2",
                    timeSent: expect.any(Number),
                    reacts: [],
                    isPinned: false,
                },
            ],
        });
        expect(search.statusCode).toBe(OK);
    });

    test("failure case: length of queryStr is less than 1 or over 1000 characters", () => {
        const channelMessage = requestMessageSendV2(
            userToken,
            channel1Id,
            "hello"
        ).returnObj;
        const dmMessage = requestMessageSendDmV2(
            userToken,
            dm1Id,
            "hello"
        ).returnObj;

        try {
            const search = request("GET", SERVER_URL + "/search/v1", {
                headers: {
                    token: userToken,
                },
                qs: {
                    queryStr: "",
                },
            });
            const searchdata = JSON.parse(search.getBody() as string);
            expect(searchdata.error).toStrictEqual(ERROR);
            expect(search.statusCode).toBe(400);
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
        }
    });

    test("failure case: token is invalid", () => {
        const channelMessage = requestMessageSendV2(
            userToken,
            channel1Id,
            "hello"
        ).returnObj;
        const dmMessage = requestMessageSendDmV2(
            userToken,
            dm1Id,
            "hello"
        ).returnObj;

        try {
            const search = request("GET", SERVER_URL + "/search/v1", {
                headers: {
                    token: "invalidToken",
                },
                qs: {
                    queryStr: "hello",
                },
            });
            const searchdata = JSON.parse(search.getBody() as string);
            expect(searchdata.error).toStrictEqual(ERROR);
            expect(search.statusCode).toBe(403);
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
        }
    });
});
