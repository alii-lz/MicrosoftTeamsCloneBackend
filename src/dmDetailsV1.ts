import { getData } from './dataStore';
import { user } from './interfaces';
import { getId } from './other';
import HTTPError from 'http-errors';

export function dmDetailsV1(token: string, dmId: number) {
  const dataStore = getData();
  // check if arugment is empty
  if (dmId === null || token === undefined) {
    // return { error: 'Missing Inputs' };
    throw HTTPError(400, 'Missing Inputs');
  }
  let dmIndex = 0;
  while (dmIndex < dataStore.dm.length && dataStore.dm[dmIndex].dmId !== dmId) {
    dmIndex++;
  }
  // check valid dmId
  if (dmIndex === dataStore.dm.length) {
    // return { error: 'Invalid dmId' };
    throw HTTPError(400, 'Invalid dmId');
  }
  // check valid token
  const user = getId(token);
  if (user === -1) {
    // return { error: 'Invalid token' };
    throw HTTPError(400, 'Invalid token');
  }
  // check if user is part of dm
  const dmess = dataStore.dm[dmIndex];
  if (!dmess.members.includes(user) && dmess.owner !== user) {
    // return {
    //   error: 'user not in the dm'

    // };
    throw HTTPError(403, 'user not in the dm');
  }
  // create array to store details
  const members: user[] = [];
  // store each member details in the dm, return the array + dm name
  for (const member of dmess.members) {
    const item = dataStore.users.find(user => user.uId === member);
    members.push({
      nameFirst: item.nameFirst,
      nameLast: item.nameLast,
      email: item.email,
      handleStr: item.handleStr,
      uId: item.uId
    });
  }

  return {
    name: dmess.name,
    members: members
  };
}
