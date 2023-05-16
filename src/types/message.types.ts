import { Message as MessagePB, Message } from '../proto/models';
import { LocalParticipant } from '../services/participant/LocalParticipant';
import { IPublishMessageArgs } from './channel.types';

export interface ILocalMessage {
    message: Message,
    localMeta: {
        sentAt?: Date,
        isAck: boolean,
        isRead: boolean,
        isMy: boolean,
    }
}

export interface ILocalMessageArgs {
    message: IPublishMessageArgs | MessagePB,
    meLocalParticipant: LocalParticipant,
}
