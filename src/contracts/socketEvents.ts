export enum WSEvents {
    ChannelJoin = 'channel:join'
}

interface IJoinResponse {
    joinAt: Date,
}

type Responses = IJoinResponse;

interface WSEvent<Event extends WSEvents, Data extends Responses> {
    event: Event,
    data: Data,
}

export interface IWSResponse {
    message?: WSEvent<WSEvents.ChannelJoin, IJoinResponse>,
}

export const WSResponse = {
    fromJSON(object:any):IWSResponse {
        return {
            message: object.event === WSEvents.ChannelJoin
                ? { event: WSEvents.ChannelJoin, data: { joinAt: new Date() } }
                : undefined,
        };
    }
};
