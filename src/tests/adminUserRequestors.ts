import request from "sync-request";
import { port, url } from "../config.json";
const SERVER_URL = `${url}:${port}`;

export function requestAdminUserRemoveV1(token: string, uId: number) {
    const res = request("DELETE", SERVER_URL + "/admin/user/remove/v1", {
        headers: {
            token: token,
        },
        qs: {
            uId: uId,
        },
    });
    return {
        status: res.statusCode,
        returnObj: JSON.parse(res.body as string),
    };
}

export function requestAdminUserPermissionChangeV1(
    token: string,
    uId: number,
    permissionId: number
) {
    const res = request(
        "POST",
        SERVER_URL + "/admin/userpermission/change/v1",
        {
            headers: {
                token: token,
            },
            json: {
                uId: uId,
                permissionId: permissionId,
            },
        }
    );
    return {
        status: res.statusCode,
        returnObj: JSON.parse(res.body as string),
    };
}
