import { getData } from "../dataStore";
import { getId } from "../other";
import { error, user } from "../interfaces";
import HTTPError from "http-errors";

interface userTemp {
    uId: number;
    email: string;
    nameFirst: string;
    nameLast: string;
    handleStr: string;
}

interface users {
    users: userTemp[];
}

/**
 * <return a list of all users and their associated details>
 *
 * @param {string} token - token of user who's calling the function
 *
 * @returns {users: []} - returns an array of users with their uId, email, nameFirst, nameLast, handleStr
 *
 * @throws {error} - returns an error if token is invalid
 *
 */
function usersAllV2(token: string): error | users {
    const data = getData();
    const id = getId(token);

    if (id === -1) {
        throw HTTPError(403, "token is invalid");
    }

    const users = data.users.map((user: user) => {
        return {
            uId: user.uId,
            email: user.email,
            nameFirst: user.nameFirst,
            nameLast: user.nameLast,
            handleStr: user.handleStr,
        };
    });

    return { users: users };
}

export { usersAllV2 };
