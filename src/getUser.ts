import { getData} from './dataStore';
import { User } from './interfaces';

// gets User object, given inputted token, if not found, return false
export function getUser(token: string): User | boolean {
  const dataStore = getData();
  // scans tokens array
  for (let i in dataStore.tokens) {
    // scans tokens for the same user
    for (let j in dataStore.tokens[i].Token) {
      // checks token is active and token given matches
      if (token == dataStore.tokens[i].Token[j].token &&
        dataStore.tokens[i].Token[j].active == true) {
          // return user: users and tokens index are the same:
          return dataStore.users[i];
      }
    }
  }
  return false;
}