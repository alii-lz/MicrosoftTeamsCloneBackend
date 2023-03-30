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
export interface Channels {
  channelId: number,
  name: string,
  isPublic: boolean,
  owners: object[],
  allMembers: object[]
}

export interface Token {
  token: string,
  active: boolean
}
export interface Data {
  users: User[];
  channels: Channels[];
  tokens: Token[];
}
export interface error {
  error: string
}

export interface authUserId {
  authUserId: number
}

export interface token {
  token: string,
  uId: number
}

export interface message {
  message: string,
  channelId: number;
}

export interface channelDetails {
  name: string,
  isPublic: string,
  ownerMembers: any[],
  allMembers: any[]
}

export interface channelMessages {
  messages: any[],
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

export interface user {
  uId: number,
  email: string,
  nameFirst: string,
  nameLast: string,
  handleStr: string
}
export interface DataStore {

  users: any[],
  channels: any[],
  tokens: any[],
  messages: any[]
}
