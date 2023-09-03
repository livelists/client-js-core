import { LocalMessage } from '../../message/LocalMessage';
import { ConnectionState } from './ConnectionState';

export enum ChannelEvents {
    RecentMessagesUpdated = 'recentMessagesUpdated',
    HistoryMessagesUpdated = 'historyMessagesUpdated',
    ConnectionStateUpdated = 'connectionStateUpdated',
    IsLoadingMoreUpdated = 'isLoadingMoreUpdated',
    ShouldScrollToBottom = 'shouldScrollToBottom'
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

export interface IIsLoadingMoreUpdated {
    event: ChannelEvents.IsLoadingMoreUpdated,
    data: {
        isLoadingMore: boolean,
    }
}

export interface IShouldScrollToBottom {
    event: ChannelEvents.ShouldScrollToBottom,
    data: {}
}

export type IChannelEmittedEvent =
    IRecentMessagesUpdated |
    IHistoryMessagesUpdated |
    IConnectionStateUpdated |
    IIsLoadingMoreUpdated |
    IShouldScrollToBottom;
