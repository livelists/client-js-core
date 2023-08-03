import { EventEmitter } from 'events';

import { ChannelWithMsg } from '../proto/events';
import { WSConnector } from '../socket/WSConnector';

export interface ILocalShortChannelArgs {
    socket: WSConnector,
    emitter: EventEmitter,
    channel: ChannelWithMsg,
}