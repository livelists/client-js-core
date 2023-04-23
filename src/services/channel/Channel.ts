import { EventEmitter } from 'events';

import { InBoundWsEvents, OutBoundWsEvents } from '../../common/const/SocketEvents';
import Config from '../../config/Config';
import { logger } from '../../config/logger';
import { Message as MessagePB } from '../../proto/models';
import { WSConnector } from '../../socket/WSConnector';
import {
    IJoinArgs,
    ILoadMoreMessagesArgs,
    IPublishMessageArgs,
} from '../../types/channel.types';
import { LocalMessage } from '../message/LocalMessage';
import { ConnectionState, ConnectionStates } from './const/ConnectionState';
import { ChannelEvents, IEmittedEvent, IOnEvent } from './const/EmittedEvents';

export class Channel {
    constructor() {
        this.emitter = new EventEmitter();
    }

    private emitter:EventEmitter;

    private socket:WSConnector|undefined;

    private emit (event:IEmittedEvent) {
        this.emitter?.emit(event.event, event.data);
    }

    public connectionState:ConnectionState = ConnectionStates.Disconnected;

    public channelId:string|undefined = undefined;

    private recentMessages:LocalMessage[] = [];

    private isLoadingMore = false;

    public async join (args:IJoinArgs) {
        Config.setUrl(args.url);
        Config.setAccessToken(args.accessToken);

        this.socket = new WSConnector();

        this.connectionState = ConnectionStates.Connecting;

        this.socket.subscribe({
            event: InBoundWsEvents.NewMessage,
            cb: this.onNewMessage.bind(this),
        });
        try {
            await this.socket.openConnection({
                url:  Config.url,
                authToken: Config.accessToken,
            });
            this.socket.publishMessage({
                $case: OutBoundWsEvents.JoinChannel,
                [OutBoundWsEvents.JoinChannel]: {
                    publishMeBecameOnline: true,
                }
            });
        } catch (e) {
            logger.error('Channel connection error');
            this.connectionState = ConnectionStates.ConnectionError;
        }
    }

    public async publishMessage(args:IPublishMessageArgs) {
        const localMessage = new LocalMessage(args);

        this.recentMessages = [...this.recentMessages, localMessage];

        this.socket?.publishMessage({
            $case: OutBoundWsEvents.SendMessage,
            [OutBoundWsEvents.SendMessage]: localMessage.getMessageForSending(),
        });
    }

    public loadHistoryMessages(args:ILoadMoreMessagesArgs) {
        this.isLoadingMore = true;
    }

    private pushMessageToList (localMessage:LocalMessage) {
        const sentMessageIndex =
            this.recentMessages.findIndex(
                (m) => m.message.message.localId = localMessage.message.message.localId
            );

        if (sentMessageIndex !== -1) {
            this.recentMessages = [...this.recentMessages, localMessage];
        } else {
            const mySentMessageCopy = this.recentMessages[sentMessageIndex];
            mySentMessageCopy.message.localMeta.isAck = true;
        }
    }

    public onNewMessage (args:MessagePB) {
        const localMessage = new LocalMessage(args);
        this.pushMessageToList(localMessage);
        this.emit({
            event: ChannelEvents.RecentMessagesUpdated,
            data: {
                messages: this.recentMessages,
            }
        });
    }

    public on({ event, cb }:IOnEvent) {
        this.emitter?.on(event, cb);
    }
}
