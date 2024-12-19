import { getId } from "../other";
import HTTPError from "http-errors";
import { Data, notification } from "../interfaces";
import { getData } from "../dataStore";

export function notificationsGetV1(token: string): { notifications: [] } {
    const data: Data = getData();
    const uId = getId(token);
    if (uId === -1) {
        throw HTTPError(403, "Invalid token.");
    }

    let dataNotiUserIndex = 0;
    while (
        dataNotiUserIndex < data.indivNotification.length &&
        data.indivNotification[dataNotiUserIndex].userId !== uId
    ) {
        dataNotiUserIndex++;
    }
    if (dataNotiUserIndex === data.indivNotification.length) {
        return { notifications: [] };
    }

    // If user has no notifications, they wouldn't even be in the data base.
    const notiDisplay: notification[] = [];
    for (let i = 0; i < 20; i++) {
        if (
            data.indivNotification[dataNotiUserIndex].notification[i] !==
            undefined
        ) {
            notiDisplay[i] =
                data.indivNotification[dataNotiUserIndex].notification[i];
            console.log(notiDisplay);
        }
    }
    //return notiDisplay;
    return { notifications: [] };
}
