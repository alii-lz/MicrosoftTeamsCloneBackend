import { getData } from "../dataStore";
import { error, User, userStats, workspaceStats, Data } from "../interfaces";
import HttpError from "http-errors";
import { getId } from "../other";

const currTime = Math.floor(new Date().getTime() / 1000);

/**
 * returns an object containing statistics about the user thats calling the function
 *
 * @param {string} token - token of the user thats calling the stats function
 *
 * @returns {HttpError} - throws an HttpError when the token passed is invalid
 * @returns {workspaceStats} - statistics about user with given token
 */
export function userStatsV1(token: string) {
    const id: number = getId(token);
    if (id === -1) {
        throw HttpError(403, "invalid token");
    }

    const data: Data = getData();

    const numChannels: number = data.channels.length;
    const numDms: number = data.dm.length;

    let numMessagesInChannels = 0;
    for (let i = 0; i < numChannels; i++) {
        numMessagesInChannels += data.channels[i].messages.length;
    }

    let numMessagesInDms = 0;
    for (let i = 0; i < numDms; i++) {
        numMessagesInChannels += data.dm[i].messages.length;
    }

    const numMessages: number = numMessagesInChannels + numMessagesInDms;

    // gets the amount of channels that the given user is in
    let numChannelsJoined: number = 0;
    let numMessagesByUserInChannels: number = 0;
    for (let i = 0; i < numChannels; i++) {
        for (let j = 0; j < data.channels[i].messages.length; j++) {
            if (data.channels[i].messages[j].uId === id) {
                numMessagesByUserInChannels++;
            }
        }

        const user = data.channels[i].allMembers.find(
            (user: User) => user.uId === id
        );
        if (user) {
            numChannelsJoined++;
        }
    }

    // gets the amount of dms that the given user is in
    let numDmsJoined: number = 0;
    let numMessagesByUserInDms: number = 0;
    for (let i = 0; i < numDms; i++) {
        for (let j = 0; j < data.dm[i].messages.length; j++) {
            if (data.dm[i].messages[j].uId === id) {
                numMessagesByUserInDms++;
            }
        }

        const user = data.dm[i].members.find((Id: number) => Id === id);
        if (user) {
            numDmsJoined++;
        }
    }

    const numMessagesSent =
        numMessagesByUserInDms + numMessagesByUserInChannels;

    const stats = {
        channelsJoined: [
            { numChannelsJoined: numChannelsJoined, timeStamp: currTime },
        ],
        dmsJoined: [{ numDmsJoined: numDmsJoined, timeStamp: currTime }],
        messagesSent: [
            { numMessagesSent: numMessagesSent, timeStamp: currTime },
        ],
        involvementRate:
            (numChannelsJoined + numDmsJoined + numMessagesSent) /
            (numChannels + numDms + numMessages),
    };

    return { userStats: stats };
}

/**
 * returns an object containing statistics about UNSW memes
 *
 * @param {string} token - token of the user thats calling the stats function
 *
 * @returns {HttpError} - throws an HttpError when the token passed is invalid
 * @returns {workspaceStats} - statistics about UNSW memes
 */
export function usersStatsV1(token: string) {
    const id: number = getId(token);
    if (id === -1) {
        throw HttpError(403, "invalid token");
    }

    const data: Data = getData();

    const numChannelsExist: number = data.channels.length;
    const numDmsExist: number = data.dm.length;

    let numMessagesInChannels: number = 0;
    for (let i = 0; i < numChannelsExist; i++) {
        numMessagesInChannels += data.channels[i].messages.length;
    }

    let numMessagesInDms: number = 0;
    for (let i = 0; i < numDmsExist; i++) {
        numMessagesInChannels += data.dm[i].messages.length;
    }

    const numMessagesExist: number = numMessagesInChannels + numMessagesInDms;

    // gets the amount of users in Memes
    let numUsers: number = 0;
    for (let i = 0; i < numChannelsExist; i++) {
        numUsers += data.channels[i].allMembers.length;
    }

    // for each user, check if they are a part of a channel
    // if they are, then increment numUsersWhoHaveJoinedAtLeastOneChannelOrDm

    const uniqueUserIds = new Set();
    for (let i = 0; i < numChannelsExist; i++) {
        for (let j = 0; j < data.channels[i].allMembers.length; j++) {
            uniqueUserIds.add(data.channels[i].allMembers[j].uId);
        }
    }

    for (let i = 0; i < numDmsExist; i++) {
        for (let j = 0; j < data.dm[i].members.length; j++) {
            uniqueUserIds.add(data.dm[i].members[j]);
        }
    }

    const stats = {
        channelsExist: [
            { numChannelsExist: numChannelsExist, timeStamp: currTime },
        ],
        dmsExist: [{ numDmsExist: numDmsExist, timeStamp: currTime }],
        messagesExist: [
            { numMessagesExist: numMessagesExist, timeStamp: currTime },
        ],
        utilizationRate: uniqueUserIds.size / numUsers,
    };

    return { workspaceStats: stats };
}
