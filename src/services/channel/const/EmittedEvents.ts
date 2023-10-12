import { LocalMessage } from '../../message/LocalMessage';
import { ConnectionState } from './ConnectionState';

export enum ChannelEvents {
    RecentMessagesUpdated = 'recentMessagesUpdated',
    HistoryMessagesUpdated = 'historyMessagesUpdated',
    ConnectionStateUpdated = 'connectionStateUpdated',
    IsLoadingMoreUpdated = 'isLoadingMoreUpdated',
    ShouldScrollToBottom = 'shouldScrollToBottom'
}

export type IRecentMessagesUpdated = {
    event: ChannelEvents.RecentMessagesUpdated,
    data: {
        messages: LocalMessage[]
    }
}

export type IHistoryMessagesUpdated = {
    event: ChannelEvents.HistoryMessagesUpdated,
    data: {
        messages: LocalMessage[]
    }
}

export type IConnectionStateUpdated = {
    event: ChannelEvents.ConnectionStateUpdated,
    data: {
        connectionState: ConnectionState,
    }
}

export type IIsLoadingMoreUpdated = {
    event: ChannelEvents.IsLoadingMoreUpdated,
    data: {
        isLoadingMore: boolean,
    }
}

export type IShouldScrollToBottom = {
    event: ChannelEvents.ShouldScrollToBottom,
    data: {}
}

export type IChannelEmittedEvent =
    IRecentMessagesUpdated |
    IHistoryMessagesUpdated |
    IConnectionStateUpdated |
    IIsLoadingMoreUpdated |
    IShouldScrollToBottom;
