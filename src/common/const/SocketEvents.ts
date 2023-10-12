export enum OutBoundWsEvents {
    SendMessage = 'sendMessage',
    JoinChannel = 'joinChannel',
    LoadMoreMessages = 'loadMoreMessages',
    LoadParticipantsReq = 'loadParticipantsReq',
    SendCustomEvent = 'sendCustomEvent',
    LoadChannelsWithMsgReq = 'loadChannelsWithMsgReq',
    UpdateLastSeenMessageAtReq = 'updateLastSeenMessageAtReq'
}

export enum InBoundWsEvents {
    NewMessage = 'newMessage',
    MeJoinedToChannel = 'meJoinedToChannel',
    LoadMoreMessagesRes = 'loadMoreMessagesRes',
    ParticipantBecameOnline = 'participantBecameOnline',
    ParticipantBecameOffline = 'participantBecameOffline',
    LoadParticipantsRes = 'loadParticipantsRes',
    NewCustomEvent = 'newCustomEvent',
    LoadChannelsWithMsgRes = 'loadChannelsWithMsgRes',
    UpdateLastSeenMessageAtRes = 'updateLastSeenMessageAtRes',
    ChannelLastSeenMessageUpdated = 'channelLastSeenMessageUpdated'
}
