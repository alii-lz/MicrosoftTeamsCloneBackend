import express, { json, Request, Response } from 'express';
import { echo } from './echo';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';
import { channelDetailsV2, channelJoinV2, 
channelInviteV2, channelMessagesV2} from './channel';
import { dmDetailsV1 } from './dmDetailsV1';
import { profileSetnameV1, profileSetemailV1, profileSethandleStrV1 } 
from './profileUsers'



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
app.get('/echo', (req: Request, res: Response, next) => {
  const data = req.query.echo as string;
  return res.json(echo(data));
});

// start server
const server = app.listen(PORT, HOST, () => {
  // DO NOT CHANGE THIS LINE
  console.log(`⚡️ Server started on port ${PORT} at ${HOST}`);
});

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
  const dmlIdString = req.query.channelId as string;
  const dmId = parseInt(dmlIdString);
  const dmDetails = dmDetailsV1(token, dmId);

  res.json(dmDetails);
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
