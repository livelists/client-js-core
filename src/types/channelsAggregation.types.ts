import { ChannelWithMsg } from '../proto/events';
import { WSConnector } from '../socket/WSConnector';

export interface IChannelsAggregationArgs {
    socket: WSConnector,
}

export interface ILoadChannelsArgs {
    messagesLimit: number,
}

export interface IShortChannelData {
    channel: ChannelWithMsg,
    unreadCount: number
}