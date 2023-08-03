import { LocalShortChannel } from '../LocalShortChannel';

export enum LocalShortChannelEvents {
    ChannelUpdated = 'channelUpdated'
}

export interface IChannelUpdated {
    event: LocalShortChannelEvents.ChannelUpdated,
    data: {
        channel: LocalShortChannel
    }
}

export type ILocalShortChannelEmittedEvent = IChannelUpdated;