import { requestDmCreate, requestDmDetails, requestDmLeave, requestDmList, requestDmRemove } from './dmRequesters';
import { requestClear } from './clearRequester';
import { requestAuthRegister } from './authRequesters';

const OK = 200;

const ERROR = { error: expect.any(String) };
let user: any;
let user2: any;
beforeEach(() => {
  requestClear();
  user = requestAuthRegister('matthew@gmail.com', 'validPassword', 'matthew', 'ieong').returnObj;
  user2 = requestAuthRegister('ali@gmail.com', 'validPassword2', 'ali', 'amend').returnObj;
});
describe('success tests for /dm/create/v2', () => {
  test('success case/ return object/ non-empty uids ', () => {
    const dmCreate = requestDmCreate(user.token, [user2.authUserId]);

    expect(dmCreate.returnObj).toStrictEqual({ dmId: expect.any(Number) });

    expect(dmCreate.status).toStrictEqual(OK);
  });

  test('success case/ return object/ empty uids', () => {
    const dmCreate = requestDmCreate(user.token, []);

    expect(dmCreate.returnObj).toStrictEqual({ dmId: expect.any(Number) });
    expect(dmCreate.status).toStrictEqual(OK);
  });

  test('success case/ non-empty uids/ test using correct dm details returned when requested by owner', () => {
    const dmCreate = requestDmCreate(user.token, [user2.authUserId]);
    const dmDetails = requestDmDetails(user.token, dmCreate.returnObj.dmId);

    expect(dmDetails.returnObj.name).toStrictEqual('aliamend, matthewieong');

    expect(dmDetails.returnObj.members).toEqual([
      {
        email: 'ali@gmail.com',
        handleStr: 'aliamend',
        nameFirst: 'ali',
        nameLast: 'amend',
        uId: user2.authUserId,
      },
      {
        email: 'matthew@gmail.com',
        handleStr: 'matthewieong',
        nameFirst: 'matthew',
        nameLast: 'ieong',
        uId: user.authUserId,
      },
    ]);
    expect(dmCreate.status).toStrictEqual(OK);
  });

  test('success case/ non-empty uids/ test using correct dm details returned when requested by member', () => {
    const dmCreate = requestDmCreate(user.token, [user2.authUserId]);
    const dmDetails = requestDmDetails(user2.token, dmCreate.returnObj.dmId);

    expect(dmDetails.returnObj.name).toStrictEqual('aliamend, matthewieong');
    expect(dmDetails.returnObj.members).toStrictEqual([{
      uId: user2.authUserId,
      nameFirst: 'ali',
      nameLast: 'amend',
      email: 'ali@gmail.com',
      handleStr: 'aliamend'
    },
    {
      uId: user.authUserId,
      nameFirst: 'matthew',
      nameLast: 'ieong',
      email: 'matthew@gmail.com',
      handleStr: 'matthewieong'
    }]);
    expect(dmCreate.status).toStrictEqual(OK);
  });

  test('success case/ empty uids/ test using correct dm details returned when requested by owner', () => {
    const dmCreate = requestDmCreate(user.token, []);
    const dmDetails = requestDmDetails(user.token, dmCreate.returnObj.dmId);

    expect(dmDetails.returnObj.name).toStrictEqual('matthewieong');
    expect(dmDetails.returnObj.members).toStrictEqual([{
      uId: user.authUserId,
      nameFirst: 'matthew',
      nameLast: 'ieong',
      email: 'matthew@gmail.com',
      handleStr: 'matthewieong'
    }]);
    expect(dmCreate.status).toStrictEqual(OK);
  });
});

describe('failure tests for /dm/create/v2', () => {
  let user: any;
  let user2: any;

  beforeEach(() => {
    requestClear();
    user = requestAuthRegister('matthew@gmail.com', 'validPassword', 'matthew', 'ieong').returnObj;
    user2 = requestAuthRegister('ali@gmail.com', 'validPassword2', 'ali', 'amend').returnObj;
  });

  test('redundant uIds', () => {
    try {
      const user3 = requestAuthRegister('arden@gmail.com', 'validpass3', 'arden', 'surname').returnObj;
      const dmCreate = requestDmCreate(user.token, [user2.authUserId, user3.authUserId, user2.authUserId]);
      expect(dmCreate.returnObj.error).toStrictEqual(ERROR);
      expect(dmCreate.status).toStrictEqual(400);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }
  });

  test('invalid uid in uids', () => {
    try {
      const invalidUid = user2.authUserId + user.authUserId;
      const dmCreate = requestDmCreate(user.token, [user2.authUserId, invalidUid]);
      expect(dmCreate.returnObj.error).toStrictEqual(ERROR);
      expect(dmCreate.status).toStrictEqual(400);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }
  });

  test('token is invalid', () => {
    try {
      const invalidToken = user2.token + user.token;
      const dmCreate = requestDmCreate(invalidToken, [user2.authUserId]);
      expect(dmCreate.returnObj.error).toStrictEqual(ERROR);
      expect(dmCreate.status).toStrictEqual(403);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }
  });
});

describe('tests for /dm/list/v2', () => {
  let user: any;
  let user2: any;
  let user3: any;
  let dm: any, dm2: any;

  beforeEach(() => {
    requestClear();
    user = requestAuthRegister('matthew@gmail.com', 'validPassword', 'matthew', 'ieong').returnObj;
    user2 = requestAuthRegister('ali@gmail.com', 'validPassword2', 'ali', 'amend').returnObj;
    user3 = requestAuthRegister('arden@gmail.com', 'validpass3', 'arden', 'surname').returnObj;

    dm = requestDmCreate(user.token, [user2.authUserId, user3.authUserId]).returnObj;
    dm2 = requestDmCreate(user2.token, [user.authUserId]).returnObj;
  });

  test('success case/testing return object', () => {
    const dmList = requestDmList(user.token);
    expect(dmList.returnObj).toStrictEqual({ dms: expect.any(Array) });
    expect(dmList.status).toStrictEqual(OK);
  });

  test('success case/ for owner', () => {
    const dmList = requestDmList(user.token);
    expect(dmList.returnObj.dms).toStrictEqual([{ name: 'aliamend, ardensurname, matthewieong', dmId: dm.dmId }, { name: 'aliamend, matthewieong', dmId: dm2.dmId }]);
    expect(dmList.status).toStrictEqual(OK);
  });

  test('success case/ for member not owner', () => {
    const dmList = requestDmList(user3.token);
    expect(dmList.returnObj.dms).toStrictEqual([{ name: 'aliamend, ardensurname, matthewieong', dmId: dm.dmId }]);
    expect(dmList.status).toStrictEqual(OK);
  });

  test('success case/ token is not of a user who is in any dm', () => {
    const user = requestAuthRegister('rudie@gmail.com', 'validPword', 'rudie', 'tate').returnObj;
    const dmList = requestDmList(user.token);
    expect(dmList.returnObj).toStrictEqual({ dms: [] });
    expect(dmList.status).toStrictEqual(OK);
  });

  test('failure case/ token is invalid', () => {
    try {
      const invalidToken = user.token.repeat(2);
      const dmList = requestDmList(invalidToken);
      expect(dmList.returnObj.error).toStrictEqual(ERROR);
      expect(dmList.status).toStrictEqual(403);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }
  });
});

describe('tests for /dm/remove/v2', () => {
  let user: any;
  let user2: any;
  let dm: any;

  beforeEach(() => {
    requestClear();
    user = requestAuthRegister('matthew@gmail.com', 'validPassword', 'matthew', 'ieong').returnObj;
    user2 = requestAuthRegister('ali@gmail.com', 'validPassword2', 'ali', 'amend').returnObj;

    dm = requestDmCreate(user.token, [user2.authUserId]).returnObj;
  });

  test('success case/ testing return object', () => {
    const dmRemove = requestDmRemove(user.token, dm.dmId);
    expect(dmRemove.returnObj).toStrictEqual({});
    expect(dmRemove.status).toStrictEqual(OK);
  });

  test('success case/ testing successful function using dmList object for an owner of the deleted DM', () => {
    requestDmCreate(user2.token, []);
    const dmRemove = requestDmRemove(user.token, dm.dmId);
    const dmList = requestDmList(user.token);
    expect(dmList.returnObj.dms).toStrictEqual([]);
    expect(dmRemove.status).toStrictEqual(OK);
  });

  test('success case/ testing successful function using dmList object for a meber who is not an owner of the deleted DM', () => {
    const dm2 = requestDmCreate(user2.token, []);
    const dmRemove = requestDmRemove(user.token, dm.dmId);
    const dmList = requestDmList(user2.token);
    expect(dmList.returnObj.dms).toStrictEqual([{ name: 'aliamend', dmId: dm2.returnObj.dmId }]);
    expect(dmRemove.status).toStrictEqual(OK);
  });
  test('failure case/member not owner', () => {
    try {
      const dmRemove = requestDmRemove(user2.token, dm.dmId);
      expect(dmRemove.returnObj.error).toStrictEqual(ERROR);
      expect(dmRemove.status).toStrictEqual(403);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }
  });

  test('failure case/ dmId does not refer to a valid dm', () => {
    try {
      const invalidDmId = dm.dmId + 1;
      const dmRemove = requestDmRemove(user.token, invalidDmId);
      expect(dmRemove.returnObj.error).toStrictEqual(ERROR);
      expect(dmRemove.status).toStrictEqual(400);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }
  });

  test('failure/ token is invalid', () => {
    try {
      const invalidToken = user.token + user2.token;
      const dmRemove = requestDmRemove(invalidToken, dm.dmId);
      expect(dmRemove.returnObj.error).toStrictEqual(ERROR);
      expect(dmRemove.status).toStrictEqual(403);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }
  });

  test('dmId is valid and the authorised user is no longer in the DM', () => {
    try {
      requestDmLeave(user.token, dm.dmId);
      const dmRemove = requestDmRemove(user.token, dm.dmId);
      expect(dmRemove.returnObj.error).toStrictEqual(ERROR);
      expect(dmRemove.status).toStrictEqual(403);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }
  });
});

describe('tests for /dm/leave/v1', () => {
  let user: any;
  let user2: any;
  let dm: any;

  beforeEach(() => {
    requestClear();
    user = requestAuthRegister('matthew@gmail.com', 'validPassword', 'matthew', 'ieong').returnObj;
    user2 = requestAuthRegister('ali@gmail.com', 'validPassword2', 'ali', 'amend').returnObj;

    dm = requestDmCreate(user.token, [user2.authUserId]).returnObj;
  });

  test('success case/ testing return object', () => {
    const dmLeave = requestDmLeave(user.token, dm.dmId);
    expect(dmLeave.returnObj).toStrictEqual({});
    expect(dmLeave.status).toStrictEqual(OK);
  });

  test('success case/ testing that the user left using dmDetails', () => {
    const dmLeave = requestDmLeave(user.token, dm.dmId);
    const dmDetails = requestDmDetails(user2.token, dm.dmId);
    expect(dmDetails.returnObj).toStrictEqual({ name: 'aliamend, matthewieong', members: [{ nameFirst: 'ali', nameLast: 'amend', email: 'ali@gmail.com', uId: user2.authUserId, handleStr: 'aliamend' }] });
    expect(dmLeave.status).toStrictEqual(OK);
  });

  test('failure case/ invalid token', () => {
    const invalidToken = user.token + user2.token;
    const dmLeave = requestDmLeave(invalidToken, dm.dmId);
    expect(dmLeave.returnObj).toStrictEqual(ERROR);
    expect(dmLeave.status).toStrictEqual(OK);
  });

  test('failure case/ invalid dmId', () => {
    const invalidDmId = dm.dmId + 1;
    const dmLeave = requestDmLeave(user.token, invalidDmId);
    expect(dmLeave.returnObj).toStrictEqual(ERROR);
    expect(dmLeave.status).toStrictEqual(OK);
  });

  test('failure case/ user already left', () => {
    requestDmLeave(user.token, dm.dmId);
    const dmLeave2 = requestDmLeave(user.token, dm.dmId);
    expect(dmLeave2.returnObj).toStrictEqual(ERROR);
    expect(dmLeave2.status).toStrictEqual(OK);
  });

  test('failure case/ user not a memeber of the DM', () => {
    const user3 = requestAuthRegister('rudie@gmail.com', 'password', 'Rudie', 'Tate').returnObj;
    const dmLeave = requestDmLeave(user3.token, dm.dmId);
    expect(dmLeave.returnObj).toStrictEqual(ERROR);
    expect(dmLeave.status).toStrictEqual(OK);
  });
});
