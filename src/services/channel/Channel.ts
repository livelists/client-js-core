import { EventEmitter } from 'events';

import { InBoundWsEvents, OutBoundWsEvents } from '../../common/const/SocketEvents';
import { logger } from '../../config/logger';
import { LoadMoreMessagesRes, MeJoinedToChannel } from '../../proto/events';
import { ChannelParticipantGrants, Message, Message as MessagePB } from '../../proto/models';
import { IWsConnector } from '../../socket/WSConnector';
import { IChannelArgs, ILoadMoreMessagesArgs, IPublishMessageArgs, } from '../../types/channel.types';
import { CustomData, IOnEvent } from '../../types/common.types';
import { CustomEvents } from '../customEvents/CustomEvents';
import { LocalMessage } from '../message/LocalMessage';
import { ChannelParticipants } from '../participant/ChannelParticipants';
import { LocalParticipant } from '../participant/LocalParticipant';
import { ConnectionState, ConnectionStates } from './const/ConnectionState';
import { ChannelEvents, IChannelEmittedEvent } from './const/EmittedEvents';
import { ScrollToBottomReasons } from './const/ScrollToBottomReasons';
import { LoadMoreMessagesError, MyLocalParticipantNotExistError } from './errors';
import { ListLoader } from './ListLoader';
import { NotSeenCounter } from './NotSeenCounter';

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
        this.listLoader = new ListLoader(this.emitter);

        this.notSeenCounter = new NotSeenCounter({
            socket: this.socket,
            channelId,
            emitter: this.emitter,
        });

        this.notSeenCounter.setFindMessageCb(this.findMessageById.bind(this));
        this.notSeenCounter.setCountMessageIntervalCb(this.countMessageInterval.bind(this));
        this.channelId = channelId;
    }

    private emitter:EventEmitter;

    private initialPageSize:number;

    private initialOffset:number;

    private channelId:string;

    private socket:IWsConnector;

    private listLoader:ListLoader;

    private localParticipant:LocalParticipant|undefined;

    private emit (event:IChannelEmittedEvent) {
        this.emitter?.emit(event.event, event.data);
    }

    public connectionState:ConnectionState = ConnectionStates.Disconnected;

    private recentMessages:LocalMessage[] = [];

    private historyMessages:LocalMessage[] = [];

    private messagesTotalCount:number|null = null;

    private findMessageById(messageId:string):MessagePB|undefined {
        return this.historyMessages.find((hm) => hm.message.message.id === messageId)?.message?.message;
    }

    private countMessageInterval(startDate:Date, endDate: Date):number {
        const startMessageIndex = this.historyMessages.findIndex(
            (m) => m.message.message.createdAt === startDate);

        const endMessageIndex = this.historyMessages.findIndex(
            (m) => m.message.message.createdAt === endDate);

        if (startMessageIndex === -1 || endMessageIndex === -1) {
            return 0;
        }

        return endMessageIndex - startMessageIndex;
    }

    public channelParticipants:ChannelParticipants| undefined;
    
    public customEvents:CustomEvents|undefined;
    
    public notSeenCounter:NotSeenCounter;

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
        this.incrementMessagesTotalCount();

        this.socket?.publishMessage({
            $case: OutBoundWsEvents.SendMessage,
            [OutBoundWsEvents.SendMessage]: localMessage.getMessageForSending(),
        });

        this.emitShouldScrollBottom({
            reason: ScrollToBottomReasons.MePublishMessage,
        });
    }

    public loadMoreMessages(args:ILoadMoreMessagesArgs) {
        if (!this.listLoader.checkIsCanLoadMore({
            isPrevLoading: args.isPrevLoading,
            firstLoadedCreatedAt: this.getFirstLoadedCreatedAt(),
            lastLoadedCreatedAt: this.getLastLoadedCreatedAt(),
        })) {
            return;
        }

        this.socket?.publishMessage({
            $case: OutBoundWsEvents.LoadMoreMessages,
            [OutBoundWsEvents.LoadMoreMessages]: {
                channelId: this.channelId,
                pageSize: args.pageSize,
                isLoadPrev: args.isPrevLoading,
                firstLoadedCreatedAt: args.isPrevLoading
                    ? this.getFirstLoadedCreatedAt()
                    : this.getLastLoadedCreatedAt(),
                skipFromFirstLoaded: args.skipFromFirstLoaded,
            }
        });

        this.listLoader.updateIsLoadingMore({
            isPrevLoading: args.isPrevLoading,
            isLoading: true
        });
    }

    private onLoadMoreMessagesRes(args:LoadMoreMessagesRes) {
        if (!args.isSuccess || !this.localParticipant) {
            throw new LoadMoreMessagesError();
        }

        this.messagesTotalCount = args.totalMessages;
        this.listLoader.firstMessageCreatedAt = args.firstMessageCreatedAt;
        this.listLoader.lastMessageCreatedAt = args.lastMessageCreatedAt;

        const localMessages = args.messages?.map(
            (m) => new LocalMessage({
                message: m,
                meLocalParticipant: this.localParticipant as LocalParticipant,
                channelId: this.channelId,
            })
        );

        this.pushMessagesToHistoryList({
            localMessages,
            isPrev: args.requestInfo?.isLoadPrev || false,
        });

        this.listLoader.updateIsLoadingMore({
            isLoading: false,
            isPrevLoading: args.requestInfo?.isLoadPrev || false,
        });
    }

    private getFirstLoadedCreatedAt ():Date {
        if (this.historyMessages?.[0]?.message?.message?.createdAt) {
            return this.historyMessages[0].message.message.createdAt;
        }
        if (this.recentMessages?.[0]?.message?.message?.createdAt) {
            return this.recentMessages[0].message.message.createdAt;
        }
        return new Date();
    };

    private getLastLoadedCreatedAt():Date {
        const lastHistoryMessage = this.historyMessages?.[this.historyMessages.length - 1];

        if (lastHistoryMessage?.message?.message?.createdAt) {
            return lastHistoryMessage.message.message.createdAt;
        }

        const lastRecentMessage = this.recentMessages?.[this.recentMessages.length - 1];
        if (lastRecentMessage?.message?.message?.createdAt) {
            return lastRecentMessage.message.message.createdAt;
        }
        return new Date();
    }

    private pushMessageToRecentList (localMessage:LocalMessage) {
        let sentMessageIndex = -1;

        if (localMessage.message.localMeta.isMy) {
            sentMessageIndex = this.recentMessages.findIndex(
                (m) => m.message.message.localId = localMessage.message.message.localId
            );
        } else {
            this.emitShouldScrollBottom({
                reason: ScrollToBottomReasons.ForeignNewMessage
            });
        }

        if (sentMessageIndex === -1) {
            this.recentMessages = [...this.recentMessages, localMessage];
            this.incrementMessagesTotalCount();
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

    private pushMessagesToHistoryList ({
        localMessages,
        isPrev,
    }:{
        localMessages:LocalMessage[],
        isPrev: boolean,
    }) {
        let resultMessages = [];

        if (isPrev) {
            resultMessages = [...localMessages, ...this.historyMessages];
        } else {
            resultMessages = [...this.historyMessages, ...localMessages];
        }
        this.historyMessages = resultMessages.sort((a, b) => (a.message.message.createdAt?.getTime() || 0) - (b.message.message?.createdAt?.getTime() || 0));
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

        if (args.createdAt) {
            this.listLoader.lastMessageCreatedAt = args.createdAt;
        }
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

        this.listLoader.firstMessageCreatedAt = args.channel?.firstMessageCreatedAt;
        this.listLoader.lastMessageCreatedAt = args.channel?.lastMessageCreatedAt;

        if (args.channel) {
            this.notSeenCounter.setInitialData({
                notSeenMessagesCount: args.channel?.notSeenMessagesCount,
                lastSeenMessageCreatedAt: args.channel?.lastSeenMessageCreatedAt,
            });
        }

        this.setInitialMessages({
            messages: args.channel?.historyMessages || [],
            myLocalParticipant: createdParticipant,
            lastSeenMessageCreatedAt: args.channel?.lastSeenMessageCreatedAt,
        });

        this.updateConnectionState(ConnectionStates.Connected);

        if (args.channel) {
            this.emit({
                event: ChannelEvents.InitialInfoUpdated,
                data: {
                    identifier: args.channel?.channelId,
                    customData: args.channel?.customData,
                    participantsCount: args.channel?.participantsCount,
                    participantsOnlineCount: args.channel?.participantsOnlineCount,
                }
            });
        }
    }

    private setInitialMessages = ({
        messages,
        myLocalParticipant,
        lastSeenMessageCreatedAt,
    }:{
        messages: Message[],
        myLocalParticipant: LocalParticipant,
        lastSeenMessageCreatedAt: Date | undefined,
    }) => {
        let isUnreadFind = false;
        const localMessages =
            messages.map((m, index) => {
                let isFirstUnseen = this.isMessageFirstUnSeen({
                    messages,
                    currentMessageCreatedAt: m.createdAt,
                    currentMessageIndex: index,
                    lastSeenMessageCreatedAt,
                    isFindFirstUnSeen: isUnreadFind,
                });

                if (isFirstUnseen) {
                    isUnreadFind = true;
                }

                return new LocalMessage({
                    message: m,
                    meLocalParticipant: myLocalParticipant,
                    channelId: this.channelId,
                    isFirstUnSeen: isFirstUnseen,
                });
            });
        if (localMessages) {
            this.pushMessagesToHistoryList({
                localMessages,
                isPrev: true,
            });
        }
    };

    private isMessageFirstUnSeen = ({
        messages,
        currentMessageCreatedAt,
        currentMessageIndex,
        lastSeenMessageCreatedAt,
        isFindFirstUnSeen,
    }:{
        messages: Message[],
        currentMessageCreatedAt: Date | undefined,
        currentMessageIndex: number,
        lastSeenMessageCreatedAt: Date | undefined,
        isFindFirstUnSeen: boolean,
    }):boolean => {
        if (isFindFirstUnSeen) {
            return false;
        }
        if (!lastSeenMessageCreatedAt || !currentMessageCreatedAt) {
            return false;
        }

        let nextMessageCreatedAt = messages?.[currentMessageIndex + 1]?.createdAt;
        let prevMessageCreatedAt = messages?.[currentMessageIndex - 1]?.createdAt;

        if (!nextMessageCreatedAt) {
            return currentMessageCreatedAt.getTime() > lastSeenMessageCreatedAt.getTime();
        }

        if (
            !prevMessageCreatedAt &&
            nextMessageCreatedAt.getTime() > lastSeenMessageCreatedAt.getTime() &&
            currentMessageCreatedAt.getTime() <=  lastSeenMessageCreatedAt.getTime()
        ) {
            return true;
        } else if (!prevMessageCreatedAt) {
            return false;
        }

        if (
            currentMessageCreatedAt.getTime() > lastSeenMessageCreatedAt.getTime() &&
            prevMessageCreatedAt.getTime() <= lastSeenMessageCreatedAt.getTime())
        {
            return true;
        }

        return false;
    };

    private incrementMessagesTotalCount = () => {
        this.messagesTotalCount = (this.messagesTotalCount || 0) + 1;
    };

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

    private emitShouldScrollBottom({
        reason
    }:{
        reason: ScrollToBottomReasons,
    }) {
        this.emit({
            event: ChannelEvents.ShouldScrollToBottom,
            data: {
                reason,
            }
        });
    }

    public on({ event, cb }:IOnEvent<IChannelEmittedEvent['event'], any>) {
        this.emitter?.on(event, cb);
    }
}
