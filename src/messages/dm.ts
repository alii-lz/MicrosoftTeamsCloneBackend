import { error, Data, tempMessage } from "../interfaces";
import { getId } from "../other";
import { getData, setData } from "../dataStore";
import HTTPError from "http-errors";

/**
 * <create a new dm and return its dmId>
 *
 * @param {string} token - token of user who's calling the function
 * @param {number[]} uIds - array of uIds of users to be added to the dm but without the creator of the dm
 *
 * @returns {dmId: number} - returns the dmId of the newly created dm
 *
 * @throws {error} - returns an error if token is invalid, any uId in uIds does not refer to a valid user, or there are duplicate uId's in uIds
 */
function dmCreate(token: string, uIds: number[]): { dmId: number } | error {
    const creatorUId: number = getId(token);
    if (creatorUId === -1) {
        throw HTTPError(403, "token is invalid");
    }

    if (uIds.includes(creatorUId) || new Set(uIds).size !== uIds.length) {
        throw HTTPError(400, "uIds repeated");
    }

    const database: Data = getData();
    for (const uId of uIds) {
        if (!database.users.find((user) => user.uId === uId)) {
            throw HTTPError(400, "invalid uId(s)");
        }
    }
    const handles: string[] = [database.users[creatorUId - 1].handleStr];
    for (const uId of uIds) {
        handles.push(database.users[uId - 1].handleStr);
    }
    handles.sort();
    // Join the sorted handles with commas and spaces
    const name: string = handles.join(", ");
    const dmId: number = database.dm.length + 1;
    uIds.push(creatorUId);
    database.dm.push({
        dmId: dmId,
        name: name,
        members: uIds,
        owner: creatorUId,
        exists: true,
        messages: [],
    });
    setData(database);
    return {
        dmId: dmId,
    };
}

/**
 * <returns the array of DMs that the user is a member of>
 *
 * @param {string} token - token of user who's calling the function
 *
 * @returns {dms: []} - returns an array of DMs that the user is a member of
 *
 * @throws {error} - returns an error if token is invalid
 */
function dmList(token: string) {
    const user = getId(token);
    if (user === -1) {
        throw HTTPError(403, "token is invalid");
    }
    const dataBase = getData();
    interface Dms {
        dmId: number;
        name: string;
    }
    const dms: Dms[] = [];
    for (const dm of dataBase.dm) {
        if (dm.exists) {
            if (dm.members.includes(user) || user === dm.owner) {
                dms.push({
                    dmId: dm.dmId,
                    name: dm.name,
                });
            }
        }
    }
    return {
        dms: dms,
    };
}

/**
 * <removes an existing DM with ID dmId, so all members are no longer in the DM>
 *
 * @param {string} token - token of user who's calling the function
 * @param {number} dmId - dmId of the DM to be removed
 *
 * @returns {} - returns an empty object
 *
 * @throws {error} - returns an error if token is invalid, dmId does not refer to a valid DM,
 *                    dmId is valid and the authorised user is not the original DM creator,
 *                    or dmId is valid and the authorised user is no longer in the DM
 */
function dmRemove(token: string, dmId: number) {
    const user = getId(token);
    if (user === -1) {
        throw HTTPError(403, "token is invalid");
    }
    const dataBase: Data = getData();
    if (dmId > dataBase.dm.length) {
        throw HTTPError(400, "invalid dmId");
    }
    const dmess = dataBase.dm[dmId - 1];
    if (!dmess.exists) {
        throw HTTPError(403, "invalid dmId");
    }
    if (!(user === dmess.owner)) {
        throw HTTPError(403, "no permission");
    }
    dataBase.dm[dmId - 1].exists = false;
    setData(dataBase);
    return {};
}

/**
 * <given a DM with ID dmId, the authorised user is removed as a member of this DM>
 *
 * @param {string} token - token of user who's calling the function
 * @param {number} dmId - dmId of the DM which the authorised user is removed as a member of
 *
 * @returns {} - returns an empty object
 *
 * @throws {error} - returns an error if token is invalid, dmId does not refer to a valid DM,
 *                  or dmId is valid and the authorised user is not a member of the DM
 */
function dmLeave(token: string, dmId: number) {
    const user = getId(token);
    if (user === -1) {
        throw HTTPError(403, "Invalid token");
    }
    const dataBase: Data = getData();

    let dmIndex = 0;
    while (dmIndex < dataBase.dm.length && dataBase.dm[dmIndex].dmId !== dmId) {
        dmIndex++;
    }
    if (dmIndex === dataBase.dm.length) {
        throw HTTPError(400, "Bad request");
    }
    if (dataBase.dm[dmIndex].exists === false) {
        throw HTTPError(400, "Bad request");
    }

    if (dataBase.dm[dmIndex].members.includes(user) === false) {
        throw HTTPError(403, "NOT A MEMBER");
    }
    if (dataBase.dm[dmIndex].owner === user) {
        dataBase.dm[dmIndex].owner = -1;
    }
    dataBase.dm[dmIndex].members.splice(user);

    setData(dataBase);
    return {};
}

/**
 * <given a DM with ID dmId that the authorised user is a member of, returns up to 50 messages>
 *
 * @param {string} token - token of user who's calling the function
 * @param {number} dmId - dmId of the DM which the authorised user is a member of
 * @param {number} start - start index of the messages to be returned
 *
 * @returns {messages: []} - returns an array of messages
 *
 * @throws {error} - returns an error if token is invalid, dmId does not refer to a valid DM,
 *                   start is greater than the total number of messages in the channel, or
 *                   dmId is valid and the authorised user is not a member of the DM
 */
function dmMessagesV1(token: string, dmId: number, start: number) {
    const user: number = getId(token);
    if (user === -1) {
        throw HTTPError(403, "Invalid token");
    }
    const dataBase: Data = getData();
    const dm = dataBase.dm.find((dm) => dm.dmId === dmId);
    if (!dm) {
        throw HTTPError(400, "invalid DmID");
    }
    if (start > dm.messages.length) {
        throw HTTPError(400, "messages not found");
    }
    if (!dm.members.includes(user)) {
        throw HTTPError(403, "user not in dm");
    }
    let end: number;
    let lastIndex = 0;
    if (start + 50 > dm.messages.length) {
        end = -1;
        lastIndex = dm.messages.length;
    } else {
        end = start + 50;
        lastIndex = end;
    }
    const messages: tempMessage[] = [];
    for (let index = start; index < lastIndex; index++) {
        messages.push(dm.messages[index]);
    }
    return {
        messages: messages,
        start: start,
        end: end,
    };
}

export { dmCreate, dmLeave, dmList, dmRemove, dmMessagesV1 };
