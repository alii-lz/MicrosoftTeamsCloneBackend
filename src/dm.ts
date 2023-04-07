
import { error } from './interfaces';
function dmCreate(token: string, uIds: number[]): {dmId: number} | error {
  return { dmId: -1 };
}

function dmList(token: string){
  return {
    dms: [];
  };
}

function dmRemove(token: string, dmId: number) {
  return {

  };
}

function dmLeave(token: string, dmId: number) {
  return {};
}

export { dmCreate, dmLeave, dmList, dmRemove };
