import { EventEmitter } from 'events';

import { InBoundWsEvents, OutBoundWsEvents } from '../../common/const/SocketEvents';
import { logger } from '../../config/logger';
import { LoadMoreMessagesRes, MeJoinedToChannel } from '../../proto/events';
import { ChannelParticipantGrants, Message as MessagePB } from '../../proto/models';
import { IWsConnector } from '../../socket/WSConnector';
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
        channelId,
    }:IChannelArgs) {
        this.initialOffset = initialOffset;
        this.initialPageSize = initialPageSize;
        this.emitter = new EventEmitter();
        this.socket = socket;
        this.channelId = channelId;
    }

    private emitter:EventEmitter;

    private initialPageSize:number;

    private initialOffset:number;

    private channelId:string;

    private socket:IWsConnector;

    private localParticipant:LocalParticipant|undefined;

    private emit (event:IChannelEmittedEvent) {
        this.emitter?.emit(event.event, event.data);
    }

    public connectionState:ConnectionState = ConnectionStates.Disconnected;

    private recentMessages:LocalMessage[] = [];

    private historyMessages:LocalMessage[] = [];

    private isLoadingMore = false;

    private messagesTotalCount:number|null = null;

    public channelParticipants:ChannelParticipants| undefined;
    
    public customEvents:CustomEvents|undefined;

    public async join () {
        this.updateConnectionState(ConnectionStates.Connecting);

        if (!this.socket.isConnected) {
            this.updateConnectionState(ConnectionStates.ConnectionError);
            return;
        }
        
        this.channelParticipants = new ChannelParticipants({
            channelId: this.channelId,
            socket: this.socket,
            emitter: this.emitter,
        });

        this.customEvents = new CustomEvents({
            socket: this.socket,
            emitter: this.emitter,
        });
            
        try {
            this.socket.publishMessage({
                $case: OutBoundWsEvents.JoinChannel,
                [OutBoundWsEvents.JoinChannel]: {
                    channelId: this.channelId,
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

    //ToDO: create buffer for publish before connect (or in disconnect)
    public async publishMessage(args:IPublishMessageArgs) {
        if (!this.localParticipant) {
            throw new MyLocalParticipantNotExistError();
        }
        const localMessage = new LocalMessage({
            message: {
                channelIdentifier: this.channelId,
                text: args.text,
                customData: args.customData,
            },
            meLocalParticipant: this.localParticipant,
            channelId: this.channelId,
        });

        this.recentMessages = [...this.recentMessages, localMessage];

        this.socket?.publishMessage({
            $case: OutBoundWsEvents.SendMessage,
            [OutBoundWsEvents.SendMessage]: localMessage.getMessageForSending(),
        });

        this.emitShouldScrollBottom();
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
                channelId: this.channelId,
                pageSize: args.pageSize,
                firstLoadedCreatedAt: this.getFirstLoadedCreatedAt(),
                skipFromFirstLoaded: args.skipFromFirstLoaded,
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
                channelId: this.channelId,
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
        this.historyMessages = [...localMessages, ...this.historyMessages].sort((a, b) => (a.message.message.createdAt?.getTime() || 0) - (b.message.message?.createdAt?.getTime() || 0));
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
            channelId: this.channelId,
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
                channelId: this.channelId,
            }));
        if (localMessages) {
            this.pushMessagesToHistoryList(localMessages);
        }
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

    private emitShouldScrollBottom() {
        this.emit({
            event: ChannelEvents.ShouldScrollToBottom,
            data: {}
        });
    }

    public on({ event, cb }:IOnEvent<IChannelEmittedEvent['event'], any>) {
        this.emitter?.on(event, cb);
    }
}
