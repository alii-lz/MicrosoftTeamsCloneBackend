export interface error {
error: string
}

export interface authUserId {
authUserId: number
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
