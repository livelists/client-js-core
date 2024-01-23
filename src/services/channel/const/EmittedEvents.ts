import { CustomData } from '../../../proto/models';
import { LocalMessage } from '../../message/LocalMessage';
import { ConnectionState } from './ConnectionState';
import { ScrollToBottomReasons } from './ScrollToBottomReasons';

export enum ChannelEvents {
    RecentMessagesUpdated = 'recentMessagesUpdated',
    HistoryMessagesUpdated = 'historyMessagesUpdated',
    ConnectionStateUpdated = 'connectionStateUpdated',
    IsLoadingMoreUpdated = 'isLoadingMoreUpdated',
    ShouldScrollToBottom = 'shouldScrollToBottom',
    InitialInfoUpdated = 'initialInfoUpdated'
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
        isPrevLoading: boolean,
    }
}

export type IShouldScrollToBottom = {
    event: ChannelEvents.ShouldScrollToBottom,
    data: {
        reason: ScrollToBottomReasons
    }
}

export type IInitialInfoUpdated = {
    event: ChannelEvents.InitialInfoUpdated,
    data: {
        identifier: string,
        customData: CustomData | undefined,
        participantsCount: number,
        participantsOnlineCount: number,
    }
}

export type IChannelEmittedEvent =
    IRecentMessagesUpdated |
    IHistoryMessagesUpdated |
    IConnectionStateUpdated |
    IIsLoadingMoreUpdated |
    IShouldScrollToBottom |
    IInitialInfoUpdated;
