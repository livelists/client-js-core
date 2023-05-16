export enum OutBoundWsEvents {
    SendMessage = 'sendMessage',
    JoinChannel = 'joinChannel',
    LoadMoreMessages = 'loadMoreMessages',
}

export enum InBoundWsEvents {
    NewMessage = 'newMessage',
    MeJoinedToChannel = 'meJoinedToChannel',
    LoadMoreMessagesRes = 'loadMoreMessagesRes'
}
