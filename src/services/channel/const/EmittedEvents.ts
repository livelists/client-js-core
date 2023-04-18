import { LocalMessage } from '../../message/LocalMessage';

export enum ChannelEvents {
    RecentMessagesUpdated = 'recentMessagesUpdated'
}

export interface IRecentMessagesUpdated {
    event: ChannelEvents.RecentMessagesUpdated,
    data: {
        messages: LocalMessage[]
    }
}

export type IEmittedEvent = IRecentMessagesUpdated
export type IOnEvent = {
    event: IRecentMessagesUpdated['event'],
    cb: (data:IRecentMessagesUpdated['data']) => void,
}
