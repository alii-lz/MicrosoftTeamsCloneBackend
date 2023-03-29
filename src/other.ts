import { resetData, getData } from './dataStore';
import { Data } from './interfaces';

function clearV1 (): object {
  resetData();
  return {};
}

// returns corresponding uId after taking a token. returns -1 if not found
function getId(token: string): number{
  const data: Data = getData();
  const validToken = data.tokens.find((item) => {
    return item.token === token && item.active === true;
  });
  if (!validToken){
    return -1;
  }
  const user = data.users.find((user) => {
    return user.tokens.includes(token);
  });
  return user.uId;

}

export { clearV1, getId };
