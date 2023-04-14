import { getData } from './dataStore';
import { user } from './interfaces';
import { getId } from './other';

export function dmDetailsV1(token: string, dmId: number) {
  const dataStore = getData();
  // if (dmId > dataStore.dm.length) {
  //   return {
  //     error: 'invalid dmId'
  //   };
  // }
  // const dmess = dataStore.dm[dmId - 1];
  // if (!dmess.exists) {
  //   return {
  //     error: 'Invalid dmId'
  //   };
  // }
  //
  // check if dmId is valid -- Arden Sae-Ueng
  // Also checking if fields are missing -- Arden Sae-Ueng
  if (dmId === null || token === undefined) {
    return { error: 'Missing Inputs' };
  }
  let dmIndex = 0;
  while (dmIndex < dataStore.dm.length && dataStore.dm[dmIndex].dmId !== dmId) {
    dmIndex++;
  }
  if (dmIndex === dataStore.dm.length) {
    return { error: 'Invalid dmId' };
  }
  //
  const user = getId(token);
  if (user === -1) {
    return { error: 'Invalid token' };
  }
  // From earlier code
  const dmess = dataStore.dm[dmIndex];
  if (!dmess.members.includes(user) && dmess.owner !== user) {
    return {
      error: 'user not in the dm'

    };
  }
  // "Does not work" -- Arden Sae-Ueng. Causes failed test for dm/create.
  // Removing dataStore
  // const owner = dataStore.users.find(user => user.uId === dmess.owner);
  const members: user[] = [];
  // if (owner) {
  //   members.push({
  //     nameFirst: owner.nameFirst,
  //     nameLast: owner.nameLast,
  //     email: owner.email,
  //     handleStr: owner.handleStr,
  //     uId: owner.uId
  //   });
  // }
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
