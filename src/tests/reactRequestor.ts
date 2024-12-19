import request from "sync-request";
import { port, url } from "../config.json";
const SERVER_URL = `${url}:${port}`;

export function reactV1(token: string, messageId: number, reactId: number) {
    const res = request("POST", SERVER_URL + "/message/react/v1", {
        headers: {
            token: token,
        },
        json: {
            messageId: messageId,
            reactId: reactId,
        },
    });
    return {
        status: res.statusCode,
        returnObj: JSON.parse(res.getBody() as string),
    };
}

export function unreactV1(token: string, messageId: number, reactId: number) {
    const res = request("POST", SERVER_URL + "/message/unreact/v1", {
        headers: {
            token: token,
        },
        json: {
            messageId: messageId,
            reactId: reactId,
        },
    });
    return {
        status: res.statusCode,
        returnObj: JSON.parse(res.getBody() as string),
    };
}
