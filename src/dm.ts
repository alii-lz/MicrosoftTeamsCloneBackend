
import { error, Data } from './interfaces';
import { getId } from './other';
import { getData, setData } from './dataStore';

function dmCreate(token: string, uIds: number[]): {dmId: number} | error {
  const creatorUId: number = getId(token);
  if (creatorUId === -1) {
    return { error: 'invalid token' };
  }

  if (uIds.includes(creatorUId) || (new Set(uIds).size !== uIds.length)) {
    return { error: 'uIds repeated' };
  }

  const database: Data = getData();
  for (const uId of uIds) {
    if (!(database.users.find(user => user.uId === uId))) {
      return {
        error: 'invalid uId(s)'
      };
    }
  }
  const handles: string[] = [database.users[creatorUId - 1].handleStr];
  for (const uId of uIds) {
    handles.push(database.users[uId - 1].handleStr);
  }
  handles.sort();
  // Join the sorted handles with commas and spaces
  const name: string = handles.join(', ');
  const dmId: number = database.dm.length + 1;
  uIds.push(creatorUId);
  database.dm.push({
    dmId: dmId,
    name: name,
    members: uIds,
    owner: creatorUId,
    exists: true,
    messages: [],
  });
  setData(database);
  return {
    dmId: dmId,
  };
}

function dmList(token: string) {
  const user = getId(token);
  if (user === -1) {
    return {
      error: 'Invalid token'
    };
  }
  const dataBase = getData();
  interface Dms{
    dmId: number,
    name: string
  }
  const dms: Dms[] = [];
  for (const dm of dataBase.dm) {
    if (dm.exists) {
      if (dm.members.includes(user) || (user === dm.owner)) {
        dms.push({
          dmId: dm.dmId,
          name: dm.name
        });
      }
    }
  }
  return {
    dms: dms
  };
}

function dmRemove(token: string, dmId: number) {
  const user = getId(token);
  if (user === -1) {
    return {
      error: 'invalid token'
    };
  }
  const dataBase: Data = getData();
  if (dmId > dataBase.dm.length) {
    return {
      error: 'invalid dmId'
    };
  }
  const dmess = dataBase.dm[dmId - 1];
  if (!(dmess.exists)) {
    return {
      error: 'invalid dmId'
    };
  }
  if (!(user === dmess.owner)) {
    return {
      error: 'no permission'
    };
  }
  dataBase.dm[dmId - 1].exists = false;
  setData(dataBase);
  return {};
}

function dmLeave(token: string, dmId: number) {
  const user = getId(token);
  if (user === -1) {
    return {
      error: 'Invalid token'
    };
  }
  const dataBase: Data = getData();

  // if (dmId > dataBase.dm.length) {
  //   return {
  //     error: 'invalid dmId'
  //   };
  // }
  // This does not work. Should NOT use the dmId as an index. May cause errors
  // -- Arden Sae-Ueng
  let dmIndex = 0;
  while (dmIndex < dataBase.dm.length && dataBase.dm[dmIndex].dmId !== dmId) {
    dmIndex++;
  }
  if (dmIndex === dataBase.dm.length) {
    return { error: 'Invalid dmId' };
  }

  if (dataBase.dm[dmIndex].members.includes(user) === false) {
    return { error: 'User not a member of the dm' };
  }

  if (dataBase.dm[dmIndex].members.includes(user) === true) {
    const memberIndex = dataBase.dm[dmIndex].members.indexOf(user);
    dataBase.dm[dmIndex].members.splice(memberIndex, 1);
  }
  if (dataBase.dm[dmIndex].owner === user) {
    dataBase.dm[dmIndex].owner = -1;
  }

  setData(dataBase);
  return {};
}
function dmMessagesV1 (token: string, dmId: number, start: number) {
  console.log('missing function <><><><><>><><><><><>');
}

export { dmCreate, dmLeave, dmList, dmRemove, dmMessagesV1 };
