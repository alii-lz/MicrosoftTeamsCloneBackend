import { getData, setData } from "../dataStore";
import { getId } from "../other";
import HTTPError from "http-errors";
export function reactV1(token: string, messageId: number, reactId: number) {
    const dataStore = getData();

    // Input validation
    if (
        messageId === undefined ||
        token === undefined ||
        reactId === undefined
    ) {
        throw HTTPError(400, "Missing Inputs");
    }

    const user = getId(token);
    if (user === -1) {
        throw HTTPError(400, "Invalid token");
    }

    if (reactId !== 1) {
        throw HTTPError(400, "Invalid reactId");
    }

    // Find message in dataStore
    const messageDetail = dataStore.messageDetails.find(
        (msg) => msg.messageId === messageId
    );

    if (!messageDetail) {
        throw HTTPError(400, "Invalid messageId.");
    }

    const isChannelMessage = messageDetail.channelId !== -1;

    if (isChannelMessage) {
        // Handle channel message
        const channel = dataStore.channels.find(
            (ch) => ch.channelId === messageDetail.channelId
        );

        if (!channel) {
            throw HTTPError(400, "Channel not found");
        }

        const message = channel.messages.find(
            (msg) => msg.messageId === messageId
        );

        if (!message) {
            throw HTTPError(400, "Message not found in channel");
        }

        // Initialize reacts array if it doesn't exist
        if (!message.reacts || !Array.isArray(message.reacts)) {
            message.reacts = [
                {
                    reactId: 1,
                    uIds: [],
                },
            ];
        }

        // Check if user already reacted
        if (message.reacts[0].uIds.includes(user)) {
            throw HTTPError(400, "User already reacted");
        }

        // Add reaction
        message.reacts[0].uIds.push(user);
    } else {
        // Handle DM message
        const dm = dataStore.dm.find((dm) => dm.dmId === messageDetail.dmId);

        if (!dm) {
            throw HTTPError(400, "DM not found");
        }

        const message = dm.messages.find((msg) => msg.messageId === messageId);

        if (!message) {
            throw HTTPError(400, "Message not found in DM");
        }

        if (!message.reacts || !Array.isArray(message.reacts)) {
            message.reacts = [
                {
                    reactId: 1,
                    uIds: [],
                },
            ];
        }

        // Check if user already reacted
        if (message.reacts[0].uIds.includes(user)) {
            throw HTTPError(400, "User already reacted");
        }

        // Add reaction
        message.reacts[0].uIds.push(user);
    }

    setData(dataStore);
    return {};
}

export function unreactV1(token: string, messageId: number, reactId: number) {
    const dataStore = getData();
    // check if arugment is empty
    if (
        messageId === undefined ||
        token === undefined ||
        reactId === undefined
    ) {
        throw HTTPError(400, "Missing Inputs");
    }
    // check valid id
    const user = getId(token);
    if (user === -1) {
        throw HTTPError(400, "Invalid token");
    }
    // check valid reactId
    if (reactId !== 1) {
        throw HTTPError(400, "Invalid reactId");
    }

    // check if messageId is valid.
    let i = 0;
    for (i = 0; i < dataStore.messageDetails.length; i++) {
        if (dataStore.messageDetails[i].messageId === messageId) {
            break;
        }
    }

    if (i === dataStore.messageDetails.length) {
        throw HTTPError(400, "Invalid messageId.");
        // return { error: 'Invalid messageId.' };
    }

    let isChannelId = false;
    if (dataStore.messageDetails[i].channelId != -1) {
        isChannelId = true;
    }

    if (isChannelId) {
        // Find the channel it is in.
        let channelIndex = 0;
        while (
            dataStore.channels[channelIndex].channelId !==
            dataStore.messageDetails[i].channelId
        ) {
            channelIndex++;
        }

        // Find the message index of the channel.
        let messageIndexInChannel = 0;
        while (
            dataStore.channels[channelIndex].messages[messageIndexInChannel]
                .messageId !== messageId
        ) {
            messageIndexInChannel++;
        }

        for (const uId of dataStore.channels[channelIndex].messages[
            messageIndexInChannel
        ].reacts[0].uIds) {
            if (uId === user) {
                let m = 0;
                while (
                    dataStore.channels[channelIndex].messages[
                        messageIndexInChannel
                    ].reacts[0].uIds[m] != user
                ) {
                    m++;
                }
                dataStore.channels[channelIndex].messages[
                    messageIndexInChannel
                ].reacts[0].uIds.splice(m, 1);
                setData(dataStore);
                return {};
            }
        }
        throw HTTPError(400, "User did not react in channel");
    } else {
        // dm
        let dmIndex = 0;

        while (
            dataStore.dm[dmIndex].dmId !== dataStore.messageDetails[i].dmId
        ) {
            /// ///////////
            dmIndex++;
        }
        let messageIndexInDm = 0;
        while (
            dataStore.dm[dmIndex].messages[messageIndexInDm].messageId !==
            messageId
        ) {
            messageIndexInDm++;
        }

        for (const uId of dataStore.dm[dmIndex].messages[messageIndexInDm]
            .reacts[0].uIds) {
            if (uId === user) {
                let m = 0;
                while (
                    dataStore.dm[dmIndex].messages[messageIndexInDm].reacts[0]
                        .uIds[m] != user
                ) {
                    m++;
                }
                dataStore.dm[dmIndex].messages[
                    messageIndexInDm
                ].reacts[0].uIds.splice(m, 1);
                setData(dataStore);
                return {};
            }
        }
        throw HTTPError(400, "User did not react in dm");
    }
}
