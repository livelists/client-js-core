import { Message as MessagePB, Message } from '../proto/models';
import { LocalParticipant } from '../services/participant/LocalParticipant';
import { IPublishMessageArgs } from './channel.types';
import {CustomData} from "./common.types";

export interface ILocalMessage {
    message: Message,
    localMeta: {
        sentAt?: Date,
        isAck: boolean,
        isRead: boolean,
        isMy: boolean,
    }
}

export interface ILocalMessageDataArgs {
    channelIdentifier: string,
    text: string,
    customData: CustomData,
}

export interface ILocalMessageArgs {
    channelId: string,
    message: ILocalMessageDataArgs | MessagePB,
    meLocalParticipant: LocalParticipant,
}
