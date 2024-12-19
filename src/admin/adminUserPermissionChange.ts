import { getId } from "../other";
import HTTPError from "http-errors";
import { Data } from "../interfaces";
import { getData, setData } from "../dataStore";

export function adminUserPermissionChangeV1(
    token: string,
    uId: number,
    permissionId: number
) {
    const data: Data = getData();
    const authUserId = getId(token);
    if (authUserId === -1) {
        throw HTTPError(403, "Invalid token.");
    }

    let authUserIndex = 0;
    while (
        authUserIndex < data.users.length &&
        data.users[authUserIndex].uId !== authUserId
    ) {
        authUserIndex++;
    }
    if (data.users[authUserIndex].globalOwner === false) {
        throw HTTPError(403, "You do not have an admin.");
    }
    let userIndex = 0;
    while (userIndex < data.users.length && data.users[userIndex].uId !== uId) {
        userIndex++;
    }
    if (data.users.length === userIndex) {
        throw HTTPError(400, "This user does not exist.");
    }
    // Check if that is the only global owner.
    let globalCheck = 0;
    let throwIndex = 0;
    const totalUsers = data.users.length;
    while (throwIndex < totalUsers) {
        if (data.users[throwIndex].globalOwner === true) {
            globalCheck++;
        }
        throwIndex++;
    }
    if (globalCheck === 1 && authUserId === uId) {
        throw HTTPError(400, "This is the only global owner.");
    }
    // Check if permissionId is valid
    if (permissionId !== 1 && permissionId !== 2) {
        throw HTTPError(400, "Invalid permission Id.");
    }

    if (permissionId === 1 && data.users[userIndex].globalOwner === true) {
        throw HTTPError(400, "User already a global owner.");
    }
    if (permissionId === 2 && data.users[userIndex].globalOwner === false) {
        throw HTTPError(400, "User already a global member.");
    }
    // Actual function.
    if (data.users[userIndex].globalOwner === true) {
        data.users[userIndex].globalOwner = false;
    }
    if (data.users[userIndex].globalOwner === false) {
        data.users[userIndex].globalOwner = true;
    }
    setData(data);
    return {};
}
