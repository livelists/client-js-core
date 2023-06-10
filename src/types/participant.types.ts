import { EventEmitter } from 'events';

import { ChannelParticipantGrants } from '../proto/models';
import { WSConnector } from '../socket/WSConnector';
import { CustomData } from './common.types';
export interface ILocalParticipantArgs {
    identifier: string,
    customData: CustomData,
    grants: ChannelParticipantGrants,
}

export interface IChannelParticipantsArgs {
    socket: WSConnector,
    emitter: EventEmitter,
}