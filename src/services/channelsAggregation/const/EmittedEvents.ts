import { LocalShortChannel } from '../LocalShortChannel';

export enum ChannelsAggregationEvents {
    ChannelsListUpdated = 'ChannelsListUpdated'
}

export interface IChannelsListUpdated {
    event: ChannelsAggregationEvents.ChannelsListUpdated,
    data: {
        channels: LocalShortChannel[]
    }
}

export type IChannelsAggregationEmittedEvent = IChannelsListUpdated;