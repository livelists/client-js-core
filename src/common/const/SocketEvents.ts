export enum OutBoundWsEvents {
    SendMessage = 'sendMessage',
    JoinChannel = 'joinChannel',
    LoadMoreMessages = 'loadMoreMessages',
    LoadParticipantsReq = 'loadParticipantsReq',
    SendCustomEvent = 'sendCustomEvent',
}

export enum InBoundWsEvents {
    NewMessage = 'newMessage',
    MeJoinedToChannel = 'meJoinedToChannel',
    LoadMoreMessagesRes = 'loadMoreMessagesRes',
    ParticipantBecameOnline = 'participantBecameOnline',
    ParticipantBecameOffline = 'participantBecameOffline',
    LoadParticipantsRes = 'loadParticipantsRes',
    NewCustomEvent = 'newCustomEvent'
}
