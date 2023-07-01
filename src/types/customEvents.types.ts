import { EventEmitter } from 'events';

import { CustomEvent } from '../proto/models';
import { WSConnector } from '../socket/WSConnector';

export interface ICustomEventsArgs {
    socket: WSConnector,
    emitter: EventEmitter,
}