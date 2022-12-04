function isSet(value: any): boolean {
    return value !== null && value !== undefined;
}

export interface IChannelJoin {
    joinAt: Date,
}

export const ChannelJoin = {
    fromJSON(object:any):IChannelJoin {
        return {
            joinAt: isSet(object.joinAt) ? new Date(object.joinAt) : new Date()
        };
    }
};
