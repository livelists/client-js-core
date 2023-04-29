import { LocalMessage } from '../../message/LocalMessage';
import { ConnectionState } from './ConnectionState';

export enum ChannelEvents {
    RecentMessagesUpdated = 'recentMessagesUpdated',
    HistoryMessagesUpdated = 'historyMessagesUpdated',
    ConnectionStateUpdated = 'connectionStateUpdated'
}

export interface IRecentMessagesUpdated {
    event: ChannelEvents.RecentMessagesUpdated,
    data: {
        messages: LocalMessage[]
    }
}

export interface IHistoryMessagesUpdated {
    event: ChannelEvents.HistoryMessagesUpdated,
    data: {
        messages: LocalMessage[]
    }
}

export interface IConnectionStateUpdated {
    event: ChannelEvents.ConnectionStateUpdated,
    data: {
        connectionState: ConnectionState,
    }
}

export type IEmittedEvent = IRecentMessagesUpdated | IHistoryMessagesUpdated | IConnectionStateUpdated;
export type IOnEvent<E, D> = {
    event: E,
    cb: (data:D) => void,
}
