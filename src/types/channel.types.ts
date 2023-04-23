export interface IJoinArgs {
    url: string,
    accessToken: string,
    initialPageSize: number,
}

export interface IPublishMessageArgs {
    text: string,
    customData?: Record<string, string>,
}

export interface ILoadMoreMessagesArgs {
    pageSize: number,
    firstLoadedCreatedAt: string,
}
