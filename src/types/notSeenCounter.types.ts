import { EventEmitter } from 'events';

import { IWsConnector } from '../socket/WSConnector';

export interface INotSeenCounter {
    socket: IWsConnector,
    channelId: string,
    emitter: EventEmitter,
}

export interface ISetInitialDataArgs {
    notSeenMessagesCount: number;
    lastSeenMessageCreatedAt?: Date;
}

export interface IReadMessageArgs {
    messageId: string,
}