import { toNamespacedPath } from 'path';
import request from 'sync-request';
import { takeCoverage } from 'v8';

import { port, url } from './config.json';
const SERVER_URL = `${url}:${port}`;
const OK = 200;
const ERROR = { error: expect.any(String) };

beforeEach(() => {
  request('DELETE', SERVER_URL + '/clear/v1', { json: {} });
});

describe('Tests for /clear/v1', () => {
  test('success case', () => {
    const res = request('DELETE', SERVER_URL + '/clear/v1');

    const data = JSON.parse(res.getBody() as string);

    expect(res.statusCode).toBe(OK);
    expect(data).toEqual({});
  });
});
