import { Message } from '../../proto/models';

export enum ChannelEvents {
    RecentMessagesUpdated = 'recentMessagesUpdated'
}

export interface IRecentMessagesUpdated {
    event: ChannelEvents.RecentMessagesUpdated,
    data: {
        messages: Message[]
    }
}

export type IEmittedEvent = IRecentMessagesUpdated
export type IOnEvent = {
    event: IRecentMessagesUpdated['event'],
    cb: (data:IRecentMessagesUpdated['data']) => void,
}
