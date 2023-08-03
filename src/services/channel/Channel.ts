import { EventEmitter } from 'events';

import { InBoundWsEvents, OutBoundWsEvents } from '../../common/const/SocketEvents';
import { logger } from '../../config/logger';
import { LoadMoreMessagesRes, MeJoinedToChannel } from '../../proto/events';
import { ChannelParticipantGrants, Message as MessagePB } from '../../proto/models';
import { WSConnector } from '../../socket/WSConnector';
import { IChannelArgs, ILoadMoreMessagesArgs, IPublishMessageArgs, } from '../../types/channel.types';
import { CustomData, IOnEvent } from '../../types/common.types';
import { CustomEvents } from '../customEvents/CustomEvents';
import { LocalMessage } from '../message/LocalMessage';
import { ChannelParticipants } from '../participant/ChannelParticipants';
import { LocalParticipant } from '../participant/LocalParticipant';
import { ConnectionState, ConnectionStates } from './const/ConnectionState';
import { ChannelEvents, IChannelEmittedEvent } from './const/EmittedEvents';
import { LoadMoreMessagesError, MyLocalParticipantNotExistError } from './errors';

export class Channel {
    constructor({
        initialOffset,
        initialPageSize,
        socket,
    }:IChannelArgs) {
        this.initialOffset = initialOffset;
        this.initialPageSize = initialPageSize;
        this.emitter = new EventEmitter();
        this.socket = socket;
    }

    private emitter:EventEmitter;

    private initialPageSize:number;

    private initialOffset:number;

    private socket:WSConnector;

    private localParticipant:LocalParticipant|undefined;

    private emit (event:IChannelEmittedEvent) {
        this.emitter?.emit(event.event, event.data);
    }

    public connectionState:ConnectionState = ConnectionStates.Disconnected;

    public channelId:string|undefined = undefined;

    private recentMessages:LocalMessage[] = [];

    private historyMessages:LocalMessage[] = [];

    private isLoadingMore = false;

    private messagesTotalCount:number|null = null;

    public channelParticipants:ChannelParticipants| undefined;
    
    public customEvents:CustomEvents|undefined;

    public async join () {
        this.channelParticipants = new ChannelParticipants({
            socket: this.socket,
            emitter: this.emitter,
        });

        this.customEvents = new CustomEvents({
            socket: this.socket,
            emitter: this.emitter,
        });

        this.updateConnectionState(ConnectionStates.Connecting);

        if (!this.socket.isConnected) {
            this.updateConnectionState(ConnectionStates.ConnectionError);
        }
        if (this.socket.isConnected)
            try {
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
                this.socket.subscribe({
                    event: InBoundWsEvents.LoadMoreMessagesRes,
                    cb: this.onLoadMoreMessagesRes.bind(this)
                });
            } catch (e) {
                logger.error('Channel connection error');
                this.updateConnectionState(ConnectionStates.ConnectionError);
            }
    }

    public async publishMessage(args:IPublishMessageArgs) {
        if (!this.localParticipant) {
            throw new MyLocalParticipantNotExistError();
        }
        const localMessage = new LocalMessage({
            message: args,
            meLocalParticipant: this.localParticipant,
        });

        this.recentMessages = [...this.recentMessages, localMessage];

        this.socket?.publishMessage({
            $case: OutBoundWsEvents.SendMessage,
            [OutBoundWsEvents.SendMessage]: localMessage.getMessageForSending(),
        });
    }

    public loadMoreMessages(args:ILoadMoreMessagesArgs) {
        if (this.isLoadingMore) {
            return;
        }
        if ((this.messagesTotalCount || -1) <= this.historyMessages.length + this.recentMessages.length) {
            return;
        }

        this.socket?.publishMessage({
            $case: OutBoundWsEvents.LoadMoreMessages,
            [OutBoundWsEvents.LoadMoreMessages]: {
                PageSize: args.pageSize,
                FirstLoadedCreatedAt: this.getFirstLoadedCreatedAt(),
                SkipFromFirstLoaded: args.skipFromFirstLoaded,
            }
        });

        this.updateIsLoadingMore(true);
    }

    private onLoadMoreMessagesRes(args:LoadMoreMessagesRes) {
        if (!args.isSuccess || !this.localParticipant) {
            throw new LoadMoreMessagesError();
        }

        this.messagesTotalCount = args.totalMessages;

        const localMessages = args.messages?.map(
            (m) => new LocalMessage({
                message: m,
                meLocalParticipant: this.localParticipant as LocalParticipant,
            })
        );

        this.pushMessagesToHistoryList(localMessages);
        this.updateIsLoadingMore(false);
    }

    private getFirstLoadedCreatedAt ():Date {
        if (this.historyMessages?.[0]?.message?.message?.createdAt) {
            return this.historyMessages[0].message.message.createdAt;
        }
        if (this.recentMessages?.[0]?.message?.message?.createdAt) {
            return (
                this.recentMessages[0].message.message.createdAt
            );
        }
        return new Date();
    };

    private pushMessageToRecentList (localMessage:LocalMessage) {
        let sentMessageIndex = -1;

        if (localMessage.message.localMeta.isMy) {
            sentMessageIndex = this.recentMessages.findIndex(
                (m) => m.message.message.localId = localMessage.message.message.localId
            );
        }

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
        this.historyMessages = [...localMessages, ...this.historyMessages];
        this.emit({
            event: ChannelEvents.HistoryMessagesUpdated,
            data: {
                messages: this.historyMessages,
            }
        });
    }

    private onNewMessage (args:MessagePB) {
        if (!this.localParticipant) {
            throw new MyLocalParticipantNotExistError();
        }
        const localMessage = new LocalMessage({
            message: args,
            meLocalParticipant: this.localParticipant,
        });
        this.pushMessageToRecentList(localMessage);
    }

    private onMeJoinedToChannel (args:MeJoinedToChannel) {
        if (!args.isSuccess) {
            this.updateConnectionState(ConnectionStates.ConnectionError);
            return;
        }

        const createdParticipant = new LocalParticipant({
            identifier: args.me?.identifier as string,
            grants: args.me?.grants as ChannelParticipantGrants,
            customData: args.me?.customData as CustomData,
        });

        this.localParticipant = createdParticipant;
        this.messagesTotalCount = args.channel?.totalMessages || null;

        const localMessages =
            args.channel?.historyMessages?.map((m) => new LocalMessage({
                message: m,
                meLocalParticipant: createdParticipant,
            }));
        if (localMessages) {
            this.pushMessagesToHistoryList(localMessages);
        }
        this.channelId = args.channel?.channelId;
        this.updateConnectionState(ConnectionStates.Connected);
    }

    private updateConnectionState(connectionState:ConnectionState) {
        this.connectionState = connectionState;
        this.emitUpdateConnectionState(connectionState);
    }

    private emitUpdateConnectionState (connectionState:ConnectionState)  {
        this.emit({
            event: ChannelEvents.ConnectionStateUpdated,
            data: {
                connectionState: connectionState,
            }
        });
    }

    private updateIsLoadingMore(isLoadingMore:boolean) {
        this.isLoadingMore = isLoadingMore;
        this.emitIsLoadingMore(isLoadingMore);
    }

    private emitIsLoadingMore(isLoadingMore:boolean) {
        this.emit({
            event: ChannelEvents.IsLoadingMoreUpdated,
            data: {
                isLoadingMore,
            }
        });
    }

    public on({ event, cb }:IOnEvent<IChannelEmittedEvent['event'], any>) {
        this.emitter?.on(event, cb);
    }
}
