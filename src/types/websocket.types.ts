import { InBoundWsEvents } from '../common/const/SocketEvents';
import {
    LoadMoreMessagesRes,
    LoadParticipantsRes,
    MeJoinedToChannel,
    ParticipantBecameOffline,
    ParticipantBecameOnline,
    LoadChannelsWithMsgRes,
} from '../proto/events';
import { CustomEvent, Message } from '../proto/models';
import { ReconnectPolicy } from '../socket/ReconnectPolicy';
import {
    IOnEvent
} from './common.types';

export interface IOpenConnectionArgs {
    url: string,
    authToken: string,
}

export interface IWsConnectorArgs {
    reconnectPolicy?: ReconnectPolicy
}

export type ISubscribeArgs = 
    IOnEvent<InBoundWsEvents.MeJoinedToChannel, MeJoinedToChannel> |
    IOnEvent<InBoundWsEvents.NewMessage, Message> |
    IOnEvent<InBoundWsEvents.LoadMoreMessagesRes, LoadMoreMessagesRes> |
    IOnEvent<InBoundWsEvents.LoadParticipantsRes, LoadParticipantsRes> |
    IOnEvent<InBoundWsEvents.ParticipantBecameOffline, ParticipantBecameOffline> |
    IOnEvent<InBoundWsEvents.ParticipantBecameOnline, ParticipantBecameOnline> |
    IOnEvent<InBoundWsEvents.NewCustomEvent, CustomEvent> | 
    IOnEvent<InBoundWsEvents.LoadChannelsWithMsgRes, LoadChannelsWithMsgRes>