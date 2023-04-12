import express, { json, Request, Response } from 'express';
import { echo } from './echo';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';

import {
  channelDetailsV2, channelJoinV2,
  channelInviteV2, channelMessagesV2
} from './channel';
import { dmCreate, dmLeave, dmList, dmRemove } from './dm';
import { dmDetailsV1 } from './dmDetailsV1';
import { profileSetnameV1, profileSetemailV1, profileSethandleStrV1 }
  from './profileUsers';
import { authRegisterV1, authLoginV1, authLogoutV1 } from './auth';
import { clearV1 } from './other';
import { messageSendV1, messageEditV1, messageRemoveV1, messageSenddmV1 } from './messageFunctions';
import { channelsCreateV2, channelsListV2 } from './channels';

// Set up web app
const app = express();
// Use middleware that allows us to access the JSON body of requests
app.use(json());
// Use middleware that allows for access from other domains
app.use(cors());
// for logging errors (print to terminal)
app.use(morgan('dev'));

const PORT: number = parseInt(process.env.PORT || config.port);
const HOST: string = process.env.IP || 'localhost';

// Example get request
app.get('/echo', (req: Request, res: Response) => {
  const data = req.query.echo as string;
  return res.json(echo(data));
});
app.delete('/clear/v1', (req: Request, res: Response) => {
  return res.json(clearV1());
});

app.post('/auth/register/v2', (req: Request, res: Response) => {
  const email = req.body.email as string;
  const password = req.body.password as string;
  const nameFirst = req.body.nameFirst as string;
  const nameLast = req.body.nameLast as string;
  return res.json(authRegisterV1(email, password, nameFirst, nameLast));
});

app.post('/auth/login/v2', (req: Request, res: Response) => {
  const email = req.body.email as string;
  const password = req.body.password as string;
  return res.json(authLoginV1(email, password));
});

app.post('/auth/logout/v1', (req: Request, res: Response) => {
  const token = req.body.token as string;
  return res.json(authLogoutV1(token));
});

app.post('/channels/create/v2', (req: Request, res: Response) => {
  const { token, name, isPublic } = req.body;

  res.json(channelsCreateV2(token, name, isPublic));
});

app.get('/channels/list/v2', (req: Request, res: Response) => {
  const token = req.query.token as string;

  res.json(channelsListV2(token));
});

app.post('/dm/create/v1', (req: Request, res: Response) => {
  const { token, uIds } = req.body;
  return res.json(dmCreate(token, uIds));
});

app.get('/dm/list/v1', (req: Request, res: Response) => {
  const token = req.query.token as string;

  return res.json(dmList(token));
});

app.delete('/dm/remove/v1', (req: Request, res: Response) => {
  const token = req.query.token as string;
  const dmId = req.query.dmId as string;
  return res.json(dmRemove(token, parseInt(dmId)));
});

app.post('/dm/leave/v1', (req: Request, res: Response) => {
  const token = req.body.token as string;
  const dmId = req.body.dmId as string;
  return res.json(dmLeave(token, parseInt(dmId)));
});

// // start server
// const server = app.listen(PORT, HOST, () => {
//   // DO NOT CHANGE THIS LINE
//   console.log(`⚡️ Server started on port ${PORT} at ${HOST}`);
// });

// channelDetailsV2
app.get('/channel/details/v2', (req: Request, res: Response) => {
  const token = req.query.token as string;
  const channelIdString = req.query.channelId as string;
  const channelId = parseInt(channelIdString);
  const details = channelDetailsV2(token, channelId);

  res.json(details);
});

// channelJoinV2
app.post('/channel/join/v2', (req: Request, res: Response) => {
  const token = req.body.token as string;
  const channelIdString = req.body.channelId as string;
  const channelId = parseInt(channelIdString);
  const channelJoin = channelJoinV2(token, channelId);

  res.json(channelJoin);
});

// dmDetailsV1
app.get('/dm/details/v1', (req: Request, res: Response) => {
  const token = req.query.token as string;
  const dmId = req.query.dmId as string;
  return res.json(dmDetailsV1(token, parseInt(dmId)));
});

// profileSetnameV1
app.put('/user/profile/setname/v1', (req: Request, res: Response) => {
  const token = req.body.token as string;
  const nameFirst = req.body.nameFirst as string;
  const nameLast = req.body.nameLast as string;
  const setName = profileSetnameV1(token, nameFirst, nameLast);

  res.json(setName);
});

// profileSetemailV1
app.put('/user/profile/setemail/v1', (req: Request, res: Response) => {
  const token = req.body.token as string;
  const email = req.body.email as string;
  const setEmail = profileSetemailV1(token, email);

  res.json(setEmail);
});

// profileSethandleStrV1
app.put('/user/profile/sethandle/v1', (req: Request, res: Response) => {
  const token = req.body.token as string;
  const handleStr = req.body.handleStr as string;
  const setHandle = profileSethandleStrV1(token, handleStr);

  res.json(setHandle);
});

// For coverage, handle Ctrl+C gracefully
process.on('SIGINT', () => {
  server.close(() => console.log('Shutting down server gracefully.'));
});

app.post('/channel/invite/v2', (req: Request, res: Response) => {
  console.log('Channel Invite');
  const { token, channelId, uId } = req.body;
  res.json(channelInviteV2(token, channelId, uId));
});

app.get('/channel/messages/v2', (req: Request, res: Response) => {
  console.log('View Channel Messages');
  const token: string = req.query.token as string;
  const channelId: number = parseInt(req.query.channelId as string);
  const start: number = parseInt(req.query.start as string);
  res.json(channelMessagesV2(token, channelId, start));
});

app.post('/message/send/v1', (req: Request, res: Response) => {
  console.log('Message Send v1');
  const { token, channelId, message } = req.body;
  res.json(messageSendV1(token, channelId, message));
});

app.put('/message/edit/v1', (req: Request, res: Response) => {
  console.log('Message Edit v1');
  const { token, messageId, message } = req.body;
  res.json(messageEditV1(token, messageId, message));
});

app.delete('/message/remove/v1', (req: Request, res: Response) => {
  console.log('Message Remove');
  const token: string = req.query.token as string;
  const messageId: number = parseInt(req.query.messageId as string);
  res.json(messageRemoveV1(token, messageId));
});

app.post('/message/senddm/v1', (req: Request, res: Response) => {
  console.log('Message Senddm v1');
  const { token, dmId, message } = req.body;
  res.json(messageSenddmV1(token, dmId, message));
});

// start server
const server = app.listen(PORT, HOST, () => {
  // DO NOT CHANGE THIS LINE
  console.log(`⚡️ Server started on port ${PORT} at ${HOST}`);
});
