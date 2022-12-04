import { JoinChannel, IJoinChannel } from './socketEventsModels';

export enum WSEvents {
    ChannelJoin = 'channel:join'
}

export interface IWSRoom {
    channelId?: string,
}

type EventData = IJoinChannel;

export interface IWSEvent<Event extends WSEvents, Data extends EventData> {
    room: IWSRoom,
    event: Event,
    data: Data,
}

export interface IWSResponse {
    message?: IWSEvent<WSEvents.ChannelJoin, IJoinChannel>,
}

export const WSResponse = {
    fromJSON(object:any):IWSResponse {
        return {
            message: object.event === WSEvents.ChannelJoin
                ? {
                    event: WSEvents.ChannelJoin,
                    room: object.room,
                    data: JoinChannel.fromJSON(object) }
                : undefined,
        };
    }
};
