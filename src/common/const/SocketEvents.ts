export enum OutBoundWsEvents {
    SendMessage = 'sendMessage',
    JoinChannel = 'joinChannel',
    LoadMoreMessages = 'loadMoreMessages',
    LoadParticipantsReq = 'loadParticipantsReq',
}

export enum InBoundWsEvents {
    NewMessage = 'newMessage',
    MeJoinedToChannel = 'meJoinedToChannel',
    LoadMoreMessagesRes = 'loadMoreMessagesRes',
    ParticipantBecameOnline = 'participantBecameOnline',
    ParticipantBecameOffline = 'participantBecameOffline',
    LoadParticipantsRes = 'loadParticipantsRes',
}
