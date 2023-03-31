
import fs from 'fs';
import { DataStore } from './interfaces';

const initialData: DataStore = {
  users: [],
  channels: [],
  tokens: [],
  messages: [],
  messageDetails: [],
};

function getData(): DataStore {
  if (fs.existsSync('data.json')) {
    const dbstr = fs.readFileSync('data.json', 'utf-8');
    const data = JSON.parse(dbstr) as DataStore;
    return data;
  }
  fs.writeFileSync('data.json', JSON.stringify(initialData), { flag: 'w' });
  return initialData;
}

function setData(newData: DataStore) {
  const jsonstr = JSON.stringify(newData);
  fs.writeFileSync('data.json', jsonstr, { flag: 'w' });
}

function resetData() {
  fs.writeFileSync('data.json', JSON.stringify(initialData), { flag: 'w' });
  return {};
}

export { getData, setData, resetData };
