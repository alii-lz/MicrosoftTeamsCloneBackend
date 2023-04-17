import HTTPError from 'http-errors';
import { getId } from './other';
import { getData } from './dataStore';
import { error, tempMessage } from './interfaces';

export function searchV1(token: string, queryStr: string): error | { messages : tempMessage[]} {
  const userId: number = getId(token);
  if (userId === -1) {
    throw HTTPError(403, 'token is invalid');
  }
  if (queryStr.length < 1 || queryStr.length > 1000) {
    throw HTTPError(400, 'length of queryStr is less than 1 or over 1000 characters');
  }
  const data = getData();
  const messages: tempMessage[] = [];
  for (const channel of data.channels) {
    for (const msg of channel.messages) {
      if (msg.uId === userId) {
        if (msg.message.toLowerCase().includes(queryStr.toLowerCase())) {
          messages.push(msg);
        }
      }
    }
  }
  for (const dm of data.dm) {
    for (const msg of dm.messages) {
      if (msg.uId === userId) {
        if (msg.message.toLowerCase().includes(queryStr.toLowerCase())) {
          messages.push(msg);
        }
      }
    }
  }

  return { messages: messages };
}
