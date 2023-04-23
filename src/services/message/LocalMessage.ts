import { SendMessage } from '../../proto/events';
import { Message as MessagePB, MessageSubType, MessageType } from '../../proto/models';
import { IPublishMessageArgs } from '../../types/channel.types';
import { ILocalMessage } from '../../types/message.types';
import { generateRandomString } from '../../utils/string/generateRandomString';

export class LocalMessage {
    constructor(message: IPublishMessageArgs | MessagePB) {
        const anyMessage = message as any;
        if (anyMessage?.localId) {
            this.wrapSentMessage(anyMessage);
        } else {
            this.wrapReceivedMessage(anyMessage);
        }
    }

    private _message:ILocalMessage|undefined = undefined;

    public get message():ILocalMessage {
        return this._message as ILocalMessage;
    }

    private wrapSentMessage = (message:IPublishMessageArgs) => {
        const localId = generateRandomString(8);

        this._message = {
            message: {
                id: localId,
                text: message.text,
                type: MessageType.Participant,
                subType: MessageSubType.TextMessage,
                localId,
                customData: message.customData ? {
                    data: message.customData,
                } : undefined,
                createdAt: new Date(),
            },
            localMeta: {
                sentAt: Date.now(),
                isAck: false,
                isRead: true,
            }
        };
    };

    private wrapReceivedMessage = (message:MessagePB) => {
        this._message = {
            message,
            localMeta: {
                isAck: true,
                isRead: false,
            }
        };
    };

    public getMessageForSending = ():SendMessage => {
        return {
            localId: this.message?.message?.localId || '',
            customData: this.message?.message?.customData || undefined,
            text: this.message?.message?.text || '',
        };
    };
}
