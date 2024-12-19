import request from "sync-request";
import config from "../../config.json";
import { resetData } from "../../dataStore";
import { requestAuthRegister } from "../authRequesters";
import { requestChannelInviteV3 } from "../channelRequestor";
import { requestAdminUserRemoveV1 } from "../adminUserRequestors";

const MAX = 22;
const OK = 200;
const port = config.port;
const url = config.url;
const SERVER_URL = `${url}:${port}`;

let user1Token: string;
let user2Token: string;
let user1Id: number;
let user2Id: number;
let channel1Id: number;

beforeEach(() => {
    resetData();
    // User 1
    const user1data = requestAuthRegister(
        "user1@hotmail.com",
        "p123445P",
        "asd",
        "qwerty"
    );
    user1Token = user1data.returnObj.token;
    user1Id = user1data.returnObj.authUserId;
    // User 2
    const user2data = requestAuthRegister(
        "user2@hotmail.com",
        "p123445P",
        "SecondGuy",
        "Sddd"
    );
    user2Token = user2data.returnObj.token;
    user2Id = user2data.returnObj.authUserId;

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
    requestChannelInviteV3(user1Token, channel1Id, user2Id);
});
// Should test for invalid token and invalid uId.
// token should be from admin.
describe("admin/user/removeV1", () => {
    test("invalid token", () => {
        const res = requestAdminUserRemoveV1("ahhhh", user2Id);
        expect(res.status).toBe(403);
    });

    test("AuthUser not a global owner", () => {
        const res = requestAdminUserRemoveV1(user2Token, user1Id);
        expect(res.status).toBe(403);
    });

    test("Invalid uId", () => {
        const res = requestAdminUserRemoveV1(user1Token, 100000);
        expect(res.status).toBe(400);
    });

    test("Deleting the only global owner", () => {
        const res = requestAdminUserRemoveV1(user1Token, user1Id);
        expect(res.status).toBe(400);
    });

    test("Success", () => {
        const res = requestAdminUserRemoveV1(user1Token, user2Id);
        expect(res.status).toBe(OK);
    });
});
