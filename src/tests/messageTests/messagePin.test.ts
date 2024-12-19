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

describe("tests for /message/pin/v1", () => {
    test("success case", () => {
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

        const pinChannelMessage = request(
            "POST",
            SERVER_URL + "/message/pin/v1",
            {
                headers: {
                    token: userToken,
                },
                json: {
                    messageId: channelMessage.messageId,
                },
            }
        );
        const channelData = JSON.parse(pinChannelMessage.getBody() as string);
        expect(channelData).toStrictEqual({});
        expect(pinChannelMessage.statusCode).toBe(OK);

        const pinDmMessage = request("POST", SERVER_URL + "/message/pin/v1", {
            headers: {
                token: userToken,
            },
            json: {
                messageId: dmMessage.messageId,
            },
        });
        const dmData = JSON.parse(pinDmMessage.getBody() as string);
        expect(dmData).toStrictEqual({});
        expect(pinDmMessage.statusCode).toBe(OK);
    });

    test("messageId is not a valid message within a channel that the authorised user is part of", () => {
        const channelMessage = requestMessageSendV2(
            userToken,
            channel1Id,
            "helloStr1"
        ).returnObj;

        try {
            const pinChannelMessage = request(
                "POST",
                SERVER_URL + "/message/pin/v1",
                {
                    headers: {
                        token: userToken,
                    },
                    json: {
                        messageId: 100,
                    },
                }
            );
            const channelData = JSON.parse(
                pinChannelMessage.getBody() as string
            );
            expect(channelData).toStrictEqual(ERROR);
            expect(pinChannelMessage.statusCode).toBe(400);
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
        }
    });

    test("messageId is not a valid message within a DM that the authorised user is part of", () => {
        const dmMessage = requestMessageSendDmV2(
            userToken,
            dm1Id,
            "helloStr2"
        ).returnObj;

        try {
            const pinDmMessage = request(
                "POST",
                SERVER_URL + "/message/pin/v1",
                {
                    headers: {
                        token: userToken,
                    },
                    json: {
                        messageId: 100,
                    },
                }
            );
            const dmData = JSON.parse(pinDmMessage.getBody() as string);
            expect(dmData).toStrictEqual(ERROR);
            expect(pinDmMessage.statusCode).toBe(400);
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
        }
    });

    test("the channel message is already pinned", () => {
        const channelMessage = requestMessageSendV2(
            userToken,
            channel1Id,
            "helloStr1"
        ).returnObj;

        try {
            const pinChannelMessage = request(
                "POST",
                SERVER_URL + "/message/pin/v1",
                {
                    headers: {
                        token: userToken,
                    },
                    json: {
                        messageId: channelMessage.messageId,
                    },
                }
            );

            const pinChannelMessage2 = request(
                "POST",
                SERVER_URL + "/message/pin/v1",
                {
                    headers: {
                        token: userToken,
                    },
                    json: {
                        messageId: channelMessage.messageId,
                    },
                }
            );
            const channelData = JSON.parse(
                pinChannelMessage2.getBody() as string
            );
            expect(channelData).toStrictEqual(ERROR);
            expect(pinChannelMessage2.statusCode).toBe(400);
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
        }
    });

    test("the dm message is already pinned", () => {
        const dmMessage = requestMessageSendDmV2(
            userToken,
            dm1Id,
            "helloStr2"
        ).returnObj;

        try {
            const pinDmMessage = request(
                "POST",
                SERVER_URL + "/message/pin/v1",
                {
                    headers: {
                        token: userToken,
                    },
                    json: {
                        messageId: dmMessage.messageId,
                    },
                }
            );

            const pinDmMessage2 = request(
                "POST",
                SERVER_URL + "/message/pin/v1",
                {
                    headers: {
                        token: userToken,
                    },
                    json: {
                        messageId: dmMessage.messageId,
                    },
                }
            );
            const dmData = JSON.parse(pinDmMessage2.getBody() as string);
            expect(dmData).toStrictEqual(ERROR);
            expect(pinDmMessage2.statusCode).toBe(400);
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
        }
    });

    test("messageId refers to a valid message in a joined channel and the authorised user does not have owner permissions in the channel/DM", () => {
        const channelMessage = requestMessageSendV2(
            userToken,
            channel1Id,
            "helloStr1"
        ).returnObj;

        try {
            const pinChannelMessage = request(
                "POST",
                SERVER_URL + "/message/pin/v1",
                {
                    headers: {
                        token: user2Token,
                    },
                    json: {
                        messageId: channelMessage.messageId,
                    },
                }
            );
            const channelData = JSON.parse(
                pinChannelMessage.getBody() as string
            );
            expect(channelData).toStrictEqual(ERROR);
            expect(pinChannelMessage.statusCode).toBe(403);
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
        }
    });

    test("messageId refers to a valid message in a joined DM and the authorised user does not have owner permissions in the channel/DM", () => {
        const dmMessage = requestMessageSendDmV2(
            userToken,
            dm1Id,
            "helloStr2"
        ).returnObj;

        try {
            const pinDmMessage = request(
                "POST",
                SERVER_URL + "/message/pin/v1",
                {
                    headers: {
                        token: user2Token,
                    },
                    json: {
                        messageId: dmMessage.messageId,
                    },
                }
            );
            const dmData = JSON.parse(pinDmMessage.getBody() as string);
            expect(dmData).toStrictEqual(ERROR);
            expect(pinDmMessage.statusCode).toBe(403);
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
        }
    });

    test("token is invalid", () => {
        const channelMessage = requestMessageSendV2(
            userToken,
            channel1Id,
            "helloStr1"
        ).returnObj;

        try {
            const pinChannelMessage = request(
                "POST",
                SERVER_URL + "/message/pin/v1",
                {
                    headers: {
                        token: "invalidToken",
                    },
                    json: {
                        messageId: channelMessage.messageId,
                    },
                }
            );
            const channelData = JSON.parse(
                pinChannelMessage.getBody() as string
            );
            expect(channelData).toStrictEqual(ERROR);
            expect(pinChannelMessage.statusCode).toBe(403);
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
        }
    });
});
