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
    customData?: Record<string, string>,
}

export interface ILoadMoreMessagesArgs {
    pageSize: number,
    firstLoadedCreatedAt: string,
}
