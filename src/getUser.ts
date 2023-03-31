import { getData} from './dataStore';

// gets User index, given inputted token, if not found, return -1
export function getUser(token: string): number{
  const dataStore = getData();
  // scans tokens array
  for (let i in dataStore.tokens) {
    // scans tokens for the same user
    for (let j in dataStore.tokens[i].Token) {
      // checks token is active and token given matches
      if (token == dataStore.tokens[i].Token[j].token &&
        dataStore.tokens[i].Token[j].active == true) {
          // return user: users and tokens index are the same:
          return parseInt(i);
      }
    }
  }
  return -1;
}