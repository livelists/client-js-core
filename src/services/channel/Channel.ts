import { EventEmitter } from 'events';

import { InBoundWsEvents, OutBoundWsEvents } from '../../common/const/SocketEvents';
import Config from '../../config/Config';
import { logger } from '../../config/logger';
import { MeJoinedToChannel } from '../../proto/events';
import { Message as MessagePB } from '../../proto/models';
import { WSConnector } from '../../socket/WSConnector';
import { IChannelArgs, IJoinArgs, ILoadMoreMessagesArgs, IPublishMessageArgs, } from '../../types/channel.types';
import { LocalMessage } from '../message/LocalMessage';
import { ConnectionState, ConnectionStates } from './const/ConnectionState';
import { ChannelEvents, IEmittedEvent, IOnEvent } from './const/EmittedEvents';

export class Channel {
    constructor({
        initialOffset,
        initialPageSize
    }:IChannelArgs) {
        this.initialOffset = initialOffset;
        this.initialPageSize = initialPageSize;
        this.emitter = new EventEmitter();
    }

    private emitter:EventEmitter;

    private initialPageSize:number;

    private initialOffset:number;

    private socket:WSConnector|undefined;

    private emit (event:IEmittedEvent) {
        this.emitter?.emit(event.event, event.data);
    }

    public connectionState:ConnectionState = ConnectionStates.Disconnected;

    public channelId:string|undefined = undefined;

    private recentMessages:LocalMessage[] = [];

    private historyMessages:LocalMessage[] = [];

    private isLoadingMore = false;

    public async join (args:IJoinArgs) {
        Config.setUrl(args.url);
        Config.setAccessToken(args.accessToken);

        this.socket = new WSConnector();

        this.connectionState = ConnectionStates.Connecting;
        this.emitUpdateConnectionState();

        try {
            await this.socket.openConnection({
                url:  Config.url,
                authToken: Config.accessToken,
            });
            this.socket.publishMessage({
                $case: OutBoundWsEvents.JoinChannel,
                [OutBoundWsEvents.JoinChannel]: {
                    initialPageSize: this.initialPageSize,
                    initialOffset: this.initialOffset,
                }
            });

            this.socket.subscribe({
                event: InBoundWsEvents.NewMessage,
                cb: this.onNewMessage.bind(this),
            });
            this.socket.subscribe({
                event: InBoundWsEvents.MeJoinedToChannel,
                cb: this.onMeJoinedToChannel.bind(this)
            });
        } catch (e) {
            logger.error('Channel connection error');
            this.connectionState = ConnectionStates.ConnectionError;
            this.emitUpdateConnectionState();
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

    private pushMessageToRecentList (localMessage:LocalMessage) {
        const sentMessageIndex =
            this.recentMessages.findIndex(
                (m) => m.message.message.localId = localMessage.message.message.localId
            );

        if (sentMessageIndex === -1) {
            this.recentMessages = [...this.recentMessages, localMessage];
        } else {
            const mySentMessageCopy = this.recentMessages[sentMessageIndex];
            mySentMessageCopy.message.localMeta.isAck = true;
        }
        this.emit({
            event: ChannelEvents.RecentMessagesUpdated,
            data: {
                messages: this.recentMessages,
            }
        });
    }

    private pushMessagesToHistoryList (localMessages:LocalMessage[]) {
        this.historyMessages = [...this.historyMessages, ...localMessages];
        this.emit({
            event: ChannelEvents.HistoryMessagesUpdated,
            data: {
                messages: this.historyMessages,
            }
        });
    }

    private onNewMessage (args:MessagePB) {
        const localMessage = new LocalMessage(args);
        this.pushMessageToRecentList(localMessage);
    }

    private onMeJoinedToChannel (args:MeJoinedToChannel) {
        if (!args.isSuccess) {
            this.connectionState = ConnectionStates.ConnectionError;
            this.emitUpdateConnectionState();
        }
        const localMessages =
            args.channel?.historyMessages?.map((m) => new LocalMessage(m));
        if (localMessages) {
            this.pushMessagesToHistoryList(localMessages);
        }
        this.connectionState = ConnectionStates.Connected;
        this.emitUpdateConnectionState();
    }

    private emitUpdateConnectionState ()  {
        this.emit({
            event: ChannelEvents.ConnectionStateUpdated,
            data: {
                connectionState: this.connectionState,
            }
        });
    }

    public on({ event, cb }:IOnEvent<IEmittedEvent['event'], any>) {
        this.emitter?.on(event, cb);
    }
}
