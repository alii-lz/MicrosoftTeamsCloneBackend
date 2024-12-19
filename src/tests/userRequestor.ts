import request from "sync-request";
import { port, url } from "../config.json";
const SERVER_URL = `${url}:${port}`;

export function requestUserProfileV3(token: string, uId: number) {
    const res = request("GET", SERVER_URL + "/user/profile/v3", {
        qs: {
            uId: uId,
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

export function requestUserProfileUploadPhotoV3(
    token: string,
    imgUrl: string,
    xStart: number,
    yStart: number,
    xEnd: number,
    yEnd: number
) {
    const res = request("POST", SERVER_URL + "/user/profile/uploadphoto/v1", {
        json: {
            imgUrl: imgUrl,
            xStart: xStart,
            yStart: yStart,
            xEnd: xEnd,
            yEnd: yEnd,
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
