export enum NotSeenCounterEmittedEvents {
    CountUpdated = 'countUpdated'
}

export interface INotSeenCountUpdated {
    event: NotSeenCounterEmittedEvents.CountUpdated,
    data: {
        count: number,
    }
}

export type INotSeenCounterEvent = INotSeenCountUpdated;