import { getData, setData } from './dataStore';
import { error } from './interfaces';
import { getUser} from './getUser'

export function dmDetailsV1(token: string, dmId: number) {
  const dataStore = getData();
  // check correct input argument
  if (token === undefined || token === null || 
    dmId === undefined || dmId === null) {
    return { error: 'Incorrect Arugment use' };
  }

  // check if dm is valid
  const dmIndex = getDm(dmId);
  if (dmIndex === -1) {
    return { error: 'invalid dmId'}};

  // check if token is valid
  // get userIndex from token
  const userIndex = getUser(token);
  // check if it is a valid token
  if (userIndex === -1) {
    return { error: 'Invalid token' };
  }
  // check if user is part of the dm
  if (!isAuthValid(userIndex)) {
    return { error: 'user is not part of the dm'}
  }
  // append all members to membersArray
  const MembersArray: string[] = [];
  for (const i in dataStore.dm[dmIndex]) {
    MembersArray.push(dataStore.dm[dmIndex].members[i]);
  }
  // return details
  return {
    name: dataStore.dm[dmIndex].name,
    members: MembersArray
  }
}

function getDm(dmId: number): number {
  const dataStore = getData();
  for (let i in dataStore.dm) {
    for (let j in dataStore.dm[i]) {
      if (dmId = dataStore.dm[i]) {
        return parseInt(i);
      }
    }
  }
  return -1;
}

function isAuthValid(userIndex: number): boolean {
  const dataStore = getData();
  for (let i in dataStore.dm) {
    // if (dataStore.users[userIndex].handleStr == dataStore.dm[i]) {
    //   return true;
    // }
    for (let j in dataStore.dm[i].members) {
      if (dataStore.users[userIndex].uid == dataStore.dm[i].members[j].uId) {
        return true;
      }
    }
  }
  return false;
}