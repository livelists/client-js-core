import { ChannelWithMsg } from '../proto/events';
import {IWsConnector, WSConnector} from '../socket/WSConnector';

export interface IChannelsAggregationArgs {
    socket: IWsConnector,
}

export interface ILoadChannelsArgs {
    messagesLimit: number,
}

export interface IShortChannelData {
    channel: ChannelWithMsg,
    unreadCount: number
}