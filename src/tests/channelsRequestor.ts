import request from "sync-request";
import { port, url } from "../config.json";
const SERVER_URL = `${url}:${port}`;

export function requestChannelsCreateV3(
    token: string,
    name: string,
    isPublic: boolean
) {
    const res = request("POST", SERVER_URL + "/channels/create/v3", {
        json: {
            name: name,
            isPublic: isPublic,
        },
        headers: {
            token: token,
        },
        timeout: 100,
    });
    return {
        status: res.statusCode,
        returnObj: JSON.parse(res.body as string),
    };
}

export function requestChannelsListV3(token: string) {
    const res = request("GET", SERVER_URL + "/channels/list/v3", {
        headers: {
            token: token,
        },
        timeout: 100,
    });
    return {
        status: res.statusCode,
        returnObj: JSON.parse(res.body as string),
    };
}
