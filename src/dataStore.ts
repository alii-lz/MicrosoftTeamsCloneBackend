import fs from 'fs';
import { Data } from './interfaces';

const initialData: Data = {
  users: [],
  channels: [],
  tokens: [],
  dm: [],
  messageDetails: [],
  resetCodes: [],
  indivNotification: []
};

function getData(): Data {
  if (fs.existsSync('data.json')) {
    const dbstr = fs.readFileSync('data.json', 'utf-8');
    const data = JSON.parse(dbstr) as Data;
    return data;
  }
  fs.writeFileSync('data.json', JSON.stringify(initialData), { flag: 'w' });
  return initialData;
}

function setData(newData: Data) {
  const jsonstr = JSON.stringify(newData);
  fs.writeFileSync('data.json', jsonstr, { flag: 'w' });
}

function resetData() {
  fs.writeFileSync('data.json', JSON.stringify(initialData), { flag: 'w' });
  return {};
}

export { getData, setData, resetData };
