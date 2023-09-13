import { EventEmitter } from 'events';

import { ChannelWithMsg } from '../proto/events';
import {IWsConnector, WSConnector} from '../socket/WSConnector';

export interface ILocalShortChannelArgs {
    socket: IWsConnector,
    emitter: EventEmitter,
    channel: ChannelWithMsg,
    messagesLimit: number | undefined,
}