import { CustomData } from './common.types';

export interface IChannelArgs {
    initialPageSize: number,
    initialOffset: number,
}

export interface IJoinArgs {
    url: string,
    accessToken: string,
}

export interface IPublishMessageArgs {
    text: string,
    customData: CustomData,
}

export interface ILoadMoreMessagesArgs {
    pageSize: number,
    skipFromFirstLoaded: number,
}
