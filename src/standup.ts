import HttpError from 'http-errors';
import { getId } from './other';
import { getData, setData } from './dataStore';
import { Channel, User, Data } from './interfaces';

function standupFinish(channelId: number, id: number) {
  const data = getData();

  const user = data.users.find((user: User) => user.uId === id);

  const channel = data.channels.find((channel: Channel) => channel.channelId === channelId);

  const finalMessage = [];

  for (let i = 0; i < channel.standup.messages.length; i++) {
    const currMessage = `${user.handleStr}:  ${channel.standup.messages[i]}`;

    finalMessage.push(currMessage);
  }

  // use channelId to loop
  // get list of messages
  // use .join to combine

  // call messageSend / add message to channel

  setData(data);

  for (let i = 0; i < finalMessage.length; i++) {
    console.log(finalMessage[i]);
  }
}

export function standupStartV1 (token: string, channelId: number, length: number): {timeFinish: number} {
  const data: Data = getData();

  const id: number = getId(token);
  if (id === -1) {
    throw HttpError(403, 'invalid token');
  }

  const channel = data.channels.find((channel: Channel) => channel.channelId === channelId);
  if (!channel) {
    throw HttpError(400, 'channelId does not refer to a valid channel');
  }

  if (length < 0) {
    throw HttpError(400, 'length is a negative integer');
  }

  if (channel.standup.isActive === true) {
    throw HttpError(400, 'an active standup is currently running in the channel');
  }

  const isMember = channel.allMembers.find((user: User) => user.uId === id);
  if (!isMember) {
    throw HttpError(403, 'channelId is valid but user isnt a member of the channel');
  }

  channel.standup.isActive = true;

  const timeout = setTimeout(() => { standupFinish(channelId, id); }, length * 1000);

  channel.standup.isActive = false;

  return { timeFinish: Math.floor((new Date()).getTime() / 1000) + length };
}

export function standupActiveV1 (token: string, channelId: number): {isActive: boolean, timeFinish: number} {
  const data: Data = getData();
  let isActive = false;
  let timeFinish = null;
  const id: number = getId(token);
  if (id === -1) {
    throw HttpError(403, 'invalid token');
  }

  const channel = data.channels.find((channel: Channel) => channel.channelId === channelId);
  if (!channel) {
    throw HttpError(400, 'channelId does not refer to a valid channel');
  }

  const isMember = channel.allMembers.find((user: User) => user.uId === id);
  if (!isMember) {
    throw HttpError(403, 'channelId is valid but user isnt a member of the channel');
  }

  if (channel.standup.isActive === true) {
    isActive = true;
    timeFinish = channel.standup.timeFinish;
  }

  return { isActive: isActive, timeFinish: timeFinish };
}

export function standupSendV1 (token: string, channelId: number, message: string): object {
  const data: Data = getData();
  const id: number = getId(token);
  if (id === -1) {
    throw HttpError(403, 'invalid token');
  }

  const channel = data.channels.find((channel: Channel) => channel.channelId === channelId);
  if (!channel) {
    throw HttpError(400, 'channelId does not refer to a valid channel');
  }

  if (message.length > 1000) {
    throw HttpError(400, 'message length is greater than 1000');
  }

  const isMember = channel.allMembers.find((user: User) => user.uId === id);
  if (!isMember) {
    throw HttpError(403, 'channelId is valid but user isnt a member of the channel');
  }

  if (channel.standup.isActive === false) {
    throw HttpError(400, 'an active standup is not currently running in the channel');
  }
  channel.standup.messages.push(message);

  return {};
}
