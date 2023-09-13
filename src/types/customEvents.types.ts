import { EventEmitter } from 'events';

import { IWsConnector } from '../socket/WSConnector';

export interface ICustomEventsArgs {
    socket: IWsConnector,
    emitter: EventEmitter,
}