import { WSConnector } from '../socket/WSConnector';

export interface IChannelsAggregationArgs {
    socket: WSConnector,
}

export interface ILoadChannelsArgs {
    messagesLimit: number,
}