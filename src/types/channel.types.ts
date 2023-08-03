import { WSConnector } from '../socket/WSConnector';
import { CustomData } from './common.types';

export interface IChannelArgs {
    initialPageSize: number,
    initialOffset: number,
    socket: WSConnector,
}

export interface IPublishMessageArgs {
    text: string,
    customData: CustomData,
}

export interface ILoadMoreMessagesArgs {
    pageSize: number,
    skipFromFirstLoaded: number,
}
