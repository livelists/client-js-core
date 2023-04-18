import { Message } from '../proto/models';

export interface ILocalMessage {
    message: Message,
    localMeta: {
        sentAt?: number,
        isAck: boolean,
        isRead: boolean,
    }
}
