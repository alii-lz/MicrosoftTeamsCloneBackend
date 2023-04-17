import HTTPError from 'http-errors';
import { getId } from './other';
import { getData, setData } from './dataStore';
import { error, message, Data } from './interfaces';

/**
 * <given a message within a channel or DM, removes its mark as "pinned">
 * 
 * @param {string} token - token of user who's calling the function
 * @param {number} messageId - id of message to be unpinned
 * 
 * @returns {} - returns an empty object
 * 
 * @throws {error} - returns an error if token is invalid, message is already unpinned, 
 *                   messageId refers to a valid message in a joined channel/DM and the authorised user does not have owner permissions in the channel/DM, 
 *                   or messageId is not a valid message within a channel or DM that the authorised user is part of
*/
export function messageUnpinV1(token: string, messageId: number): error | {} {
  const userId: number = getId(token);
  if (userId === -1) {
    throw HTTPError(403, 'token is invalid');
  }
  console.log(token)
  console.log(messageId)
  const data: Data = getData();
  let found = false;
  for (const channel of data.channels) {
    for (const msg of channel.messages) {
      if (msg.messageId === messageId) {
        if (!msg.isPinned) {
          throw HTTPError(400, 'message is already unpinned');
        }
        if (msg.uId !== userId) {
          throw HTTPError(403, 'messageId refers to a valid message in a joined channel/DM and the authorised user does not have owner permissions in the channel/DM');
        }
        msg.isPinned = false;
        found = true;
        break;
      }
    }
    if (found) {
      break;
    }
  }
  if (!found) {
    for (const dm of data.dm) {
      for (const msg of dm.messages) {
        if (msg.messageId === messageId) {
          if (!msg.isPinned) {
            throw HTTPError(400, 'message is already unpinned');
          }
          if (msg.uId !== userId) {
            throw HTTPError(403, 'messageId refers to a valid message in a joined channel/DM and the authorised user does not have owner permissions in the channel/DM');
          }
          msg.isPinned = false;
          found = true;
          break;
        }
      }
      if (found) {
        break;
      }
    }
  }

  if (!found) {
    throw HTTPError(400, 'messageId is not a valid message within a channel or DM that the authorised user is part of');
  }

  setData(data);
  return {};
}