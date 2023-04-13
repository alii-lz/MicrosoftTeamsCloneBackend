export interface User {
  uId: number,
  nameFirst: string,
  nameLast: string,
  password: string,
  email: string,
  handleStr: string,
  globalOwner: boolean
  tokens: string[];
}

export interface user {
  uId: number,
  nameFirst: string,
  nameLast: string,
  email: string,
  handleStr: string,
}
export interface tempMessage {
  message: string,
  uId: number,
  messageId: number,
  timeSent: number
}
export interface Channel{
  channelId: number,
  name: string,
  isPublic: boolean,
  owners: user[],
  allMembers: user[],
  messages: tempMessage[],
}

export interface Token {
  token: string,
  active: boolean
}
export interface messageDetails {
  messageId: number,
  uId: number,
  channelId: number,
  dmId: number,
}
export interface dm {
  dmId: number,
  members: number[]
  name: string,
  owner: number,
  exists: boolean,
  messages: tempMessage[],
}
export interface Data {
  users: User[];
  channels: Channel[];
  tokens: Token[];
  messageDetails: messageDetails[],
  dm: dm[]
}

export interface error {
  error: string
}

export interface authUserId {
  authUserId: number
}

export interface message {
  message: string,
  channelId: number;
}

export interface channelDetails {
  name: string,
  isPublic: boolean,
  ownerMembers: any[],
  allMembers: any[]
}

export interface channelDetailsWithMessages {
  name: string,
  isPublic: string,
  ownerMembers: any[],
  allMembers: any[],
  messages: any[],
}

export interface channelMessages {
  messages: tempMessage[],
  start: number,
  end: number
}

export interface channelId {
  channelId: number
}

export interface channelsTemp {
  channelId: number,
  name: string,
}

export interface channels {
  channels: channelsTemp[]
}

export interface emptyObject {
  
}

export interface messageIDReturn {
  messageId: number,
}