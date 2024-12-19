import request from "sync-request";
import { port, url } from "../config.json";
const SERVER_URL = `${url}:${port}`;

export function requestClear() {
    const res = request("DELETE", SERVER_URL + "/clear/v1", {
        qs: {},
    });
    return {
        status: res.statusCode,
        returnObj: JSON.parse(res.getBody() as string),
    };
}
