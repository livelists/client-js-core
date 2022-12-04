function isSet(value: any): boolean {
    return value !== null && value !== undefined;
}

export interface IJoinChannel {
    joinAt: Date,
}

export const JoinChannel = {
    fromJSON(object:any):IJoinChannel {
        return {
            joinAt: isSet(object.joinAt) ? new Date(object.joinAt) : new Date()
        };
    }
};
