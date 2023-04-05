import { Message } from '../proto/models';

export interface IMessageWithMeta {
    data: Message,
    local: {
        localId: string,
        sentAt: Date,
    }
}
