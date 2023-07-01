import { CustomEvent } from '../../../proto/models';

export enum CustomEventsEmitEvents {
    NewCustomEvent = 'newCustomEvent'
}

export interface INewCustomEvents {
    event: CustomEventsEmitEvents.NewCustomEvent,
    data: CustomEvent
}

export type ICustomEventsEmittedEvent = INewCustomEvents;

export type IOnEvent<E, D> = {
    event: E,
    cb: (data:D) => void,
}