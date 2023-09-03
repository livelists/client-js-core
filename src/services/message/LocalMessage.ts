import { SendMessage } from '../../proto/events';
import { Message as MessagePB, MessageSubType, MessageType, CustomData } from '../../proto/models';
import { ILocalMessage, ILocalMessageArgs, ILocalMessageDataArgs } from '../../types/message.types';
import { generateRandomString } from '../../utils/string/generateRandomString';
import { LocalParticipant } from '../participant/LocalParticipant';

export class LocalMessage {
    constructor({
        message,
        meLocalParticipant,
        channelId
    }:ILocalMessageArgs) {
        const anyMessage = message as any;
        this._meLocalParticipant = meLocalParticipant;
        this.channelId = channelId;
        if (anyMessage?.id) {
            this.wrapReceivedMessage(anyMessage);
        } else {
            this.wrapSentMessage(anyMessage);
        }
    }

    private _message:ILocalMessage|undefined = undefined;

    private channelId:string;

    private _meLocalParticipant:LocalParticipant;

    public get message():ILocalMessage {
        return this._message as ILocalMessage;
    }

    private wrapSentMessage = (message:ILocalMessageDataArgs) => {
        const localId = generateRandomString(8);

        this._message = {
            message: {
                id: localId,
                channelIdentifier: message.channelIdentifier,
                text: message.text,
                type: MessageType.ParticipantCreated,
                sender: {
                    identifier: this._meLocalParticipant.identifier,
                    isOnline: true,
                    customData: this._meLocalParticipant.customData?.data
                        ? this._meLocalParticipant.customData as any as CustomData : undefined,
                },
                subType: MessageSubType.TextMessage,
                localId: localId,
                customData: message.customData ? {
                    data: message.customData,
                } : undefined,
                createdAt: new Date(),
            },
            localMeta: {
                sentAt: new Date(),
                isAck: false,
                isRead: true,
                isMy: true,
            }
        };
    };

    private wrapReceivedMessage = (message:MessagePB) => {
        this._message = {
            message,
            localMeta: {
                isAck: true,
                isRead: false,
                isMy: message.sender?.identifier === this._meLocalParticipant.identifier,
            }
        };
    };

    public getMessageForSending = ():SendMessage => {
        return {
            localId: this.message?.message?.localId || '',
            customData: this.message?.message?.customData || undefined,
            text: this.message?.message?.text || '',
            channelId: this.channelId,
        };
    };
}
