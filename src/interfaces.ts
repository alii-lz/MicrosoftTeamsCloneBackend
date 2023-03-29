export interface User{
    uId: number,
    nameFirst:string,
    nameLast: string,
    password: string,
    email: string,
    handleStr: string,
    globalOwner: boolean

}
export interface Channels{
    channelId: number,
    name: string,
    isPublic: boolean,
    owners: object[],
    allMembers: object[]
}

export interface Token{
    token: string,
    active: boolean
}
export interface Data {
    users: User[];
    channels: Channels[];
    tokens: Token[];
  }
