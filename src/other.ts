import { resetData } from './dataStore';

function clearV1 (): object {
  resetData();
  return {};
}

export { clearV1 };
