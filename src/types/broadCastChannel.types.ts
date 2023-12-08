export enum BroadCastEventNames {
    UpdateChannelNotSeenCount = 'updateChannelNotSeenCount'
}

export interface IBroadCastEvent<E, D> {
    event: E,
    data: D,
}

export interface IOnBroadCastEvent<E, D> {
    event: E,
    cb: (data:D) => void,
}

export interface IUpdateChannelNotSeenCount {
    channelId: string;
    count: number
}

export type OnBroadCastEvents = IOnBroadCastEvent<BroadCastEvents['event'], BroadCastEvents['data']>

export type BroadCastEvents = IBroadCastEvent<BroadCastEventNames.UpdateChannelNotSeenCount, IUpdateChannelNotSeenCount>