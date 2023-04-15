import { getData } from './dataStore';
import { setData } from './dataStore';
import validator from 'validator';
import { Data } from './interfaces';
import { getId } from './other';
import HTTPError from 'http-errors';
const nodemailer = require('nodemailer');
const passwordHash = require('password-hash');
const UIDGenerator = require('uid-generator');
const tokenGenerator = new UIDGenerator(32, UIDGenerator.BASE16);

function authRegisterV1(email: string, password: string, nameFirst: string, nameLast: string) {
  const invalidFirstName = (nameFirst.length < 1 || nameFirst.length > 50);

  const invalidLastName = (nameLast.length < 1 || nameLast.length > 50);

  const invalidPassword = (password.length < 6);

  const invalidEmail = (!validator.isEmail(email));

  if (invalidFirstName || invalidLastName || invalidPassword || invalidEmail) {
    throw HTTPError(400, 'Bad request');
  }

  const data: Data = getData();
  const ifDataStoreEmpty = (data.users.length === 0);
  let globalOwner = false;
  if (ifDataStoreEmpty) {
    globalOwner = true;
  }

  if (!ifDataStoreEmpty) {
    const registeredUser = data.users.find((user) => user.email === email);

    if (registeredUser) {
      throw HTTPError(400, 'Bad request');
    }
  }

  const uId = data.users.length + 1;

  let handleStr = (nameFirst + nameLast).toLowerCase();
  handleStr = handleStr.replace(/\W/g, '');

  if (!ifDataStoreEmpty) {
    const existingHandle = data.users.find(user => user.handleStr.includes(handleStr));
    if (existingHandle) {
      handleStr = existingHandle.handleStr;

      const endCharacter = handleStr.slice(-1);

      handleStr = !isNaN(parseInt(endCharacter)) ? handleStr.replace(/.$/, (parseInt(endCharacter) + 1).toString()) : `${handleStr}0`;
    }
  }

  const newToken = tokenGenerator.generateSync();
  const newUser = {
    uId: uId,
    email: email,
    password: passwordHash.generate(password),
    nameFirst: nameFirst,
    nameLast: nameLast,
    handleStr: handleStr,
    globalOwner: globalOwner,
    tokens: [newToken]
  };

  data.users.push(newUser);
  data.tokens.push({
    token: newToken,
    active: true
  });

  setData(data);
  return { authUserId: uId, token: newToken };
}

function authLoginV1(email: string, password: string) {
  const data: Data = getData();
  if (data.users.length === 0) {
    throw HTTPError(400, 'Bad request');
  }
  const user = data.users.find(user => user.email === email);
  if (!user) {
    throw HTTPError(400, 'Bad request');
  }

  if (!passwordHash.verify(password, user.password)) {
    throw HTTPError(400, 'Bad request');
  }
  const newToken = tokenGenerator.generateSync();
  user.tokens.push(newToken);
  data.tokens.push({
    token: newToken,
    active: true
  });
  setData(data);
  return {
    authUserId: user.uId,
    token: newToken
  };
}

function authLogoutV1(token: string) {
  if (getId(token) === -1) {
    throw HTTPError(400, 'Bad request');
  }
  const data: Data = getData();
  const tokenFinder = data.tokens.findIndex((item) => item.token === token);
  data.tokens[tokenFinder].active = false;
  setData(data);
  return {};
}
function authPasswordResetRequestV1(email: string) {
  const data: Data = getData();
  const userFind = data.users.find(user => user.email === email);
  if (!userFind) {
    return {};
  }
  for (const token of userFind.tokens) {
    for (const item of data.tokens) {
      if (token === item.token) {
        item.active = false;
      }
    }
  }
  const codeGenerator = new UIDGenerator(64, UIDGenerator.BASE16);
  const resetCode = codeGenerator.generateSync();
  data.resetCodes.push({
    code: resetCode,
    uId: userFind.uId,
    valid: true
  });

  // Generate SMTP service account from ethereal.email
  nodemailer.createTestAccount((err, account) => {
    if (err) {
      console.error('Failed to create a testing account. ' + err.message);
      return process.exit(1);
    }

    console.log('Credentials obtained, sending message...');

    // Create a SMTP transporter object
    const transporter = nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: account.user,
        pass: account.pass
      }
    });

    // Message object
    const message = {
      from: 'Sender UNSWMEMES <unswmemes007@gmail.com>',
      to: `Recipient <${email}>`,
      subject: 'Reset Code',
      text: `${resetCode}`,
      html: '<p>Use this code to reset password</p>'
    };

    transporter.sendMail(message, (err, info) => {
      if (err) {
        console.log('Error occurred. ' + err.message);
        return process.exit(1);
      }
      console.log('Message sent: %s', info.messageId);
      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
  });
  setData(data);

  return {};
}

function authPasswordResetResetV1(resetCode: string, newPassword: string) {
  const data: Data = getData();
  const match = data.resetCodes.find(item => (item.code === resetCode && item.valid === true));
  if (!match) {
    throw HTTPError(400, 'invalid code');
  }
  if (newPassword.length < 6) {
    throw HTTPError(400, 'invalid password');
  }
  data.users[match.uId - 1].password = newPassword;
  for (const item of data.resetCodes) {
    if (item.code === resetCode) {
      item.valid = false;
    }
  }
  setData(data);
  return {};
}

export { authRegisterV1, authLoginV1, authLogoutV1, authPasswordResetRequestV1, authPasswordResetResetV1 };
