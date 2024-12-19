import { getId } from "../other";
import HTTPError from "http-errors";
import { Data } from "../interfaces";
import { getData, setData } from "../dataStore";

export function adminUserRemoveV1(token: string, uId: number) {
    const data: Data = getData();
    const authUserId = getId(token);
    if (authUserId === -1) {
        throw HTTPError(403, "Invalid token.");
    }

    // Check if authUserId belongs to global owner
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

    // Check if uId is valid
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
    // Delete.
    // We have the index of the uId in data.users
    data.users[userIndex].nameFirst = "Removed";
    data.users[userIndex].nameLast = "user";
    data.users[userIndex].email = undefined;
    data.users[userIndex].handleStr = undefined;
    data.users[userIndex].tokens = [];
    data.users[userIndex].password = undefined;

    let dmIndex = 0;
    while (dmIndex < data.dm.length) {
        if (data.dm[dmIndex].members.includes(uId) === true) {
            const index = data.dm[dmIndex].members.indexOf(uId);
            data.dm[dmIndex].members.splice(index, 1);
        }
        dmIndex++;
    }
    let channelIndex = 0;
    while (channelIndex < data.channels.length) {
        let allMemberIndex = 0;
        while (allMemberIndex < data.channels[channelIndex].allMembers.length) {
            if (
                data.channels[channelIndex].allMembers[allMemberIndex].uId ===
                uId
            ) {
                data.channels[channelIndex].allMembers.splice(
                    allMemberIndex,
                    1
                );
            }
            allMemberIndex++;
        }
        channelIndex++;
    }

    let messageIndex = 0;
    while (messageIndex < data.messageDetails.length) {
        if (data.messageDetails[messageIndex].uId === uId) {
            // If it is a channel message.
            if (data.messageDetails[messageIndex].channelId !== -1) {
                // Index for the channel
                let channelIndex = 0;
                while (
                    data.channels[channelIndex].channelId !==
                        data.messageDetails[messageIndex].channelId &&
                    channelIndex < data.channels.length
                ) {
                    channelIndex++;
                }
                // Index for the message
                let channelMessageIndex = 0;
                while (
                    data.channels[channelIndex].messages[channelMessageIndex]
                        .messageId !==
                    data.messageDetails[messageIndex].messageId
                ) {
                    channelMessageIndex++;
                }
                data.channels[channelIndex].messages.splice(
                    channelMessageIndex,
                    1
                );
            } else if (data.messageDetails[messageIndex].dmId !== -1) {
                // Index for the channel
                let dmIndex = 0;
                while (
                    data.dm[dmIndex].dmId !==
                        data.messageDetails[messageIndex].dmId &&
                    dmIndex < data.dm.length
                ) {
                    dmIndex++;
                }
                // Index for the message
                let dmMessageIndex = 0;
                while (
                    data.dm[dmIndex].messages[dmMessageIndex].messageId !==
                        data.messageDetails[messageIndex].messageId &&
                    dmMessageIndex < data.dm[dmIndex].messages.length
                ) {
                    dmMessageIndex++;
                }
                data.dm[dmIndex].messages.splice(dmMessageIndex, 1);
            }
        }
        messageIndex++;
    }
    setData(data);
    return {};
}
