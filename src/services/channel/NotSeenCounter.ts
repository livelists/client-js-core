import { EventEmitter } from 'events';

import { BroadCast } from '../../broadcastChannel/BroadCast';
import { BroadCastChannels } from '../../common/const/BroadCastChannels';
import { OutBoundWsEvents } from '../../common/const/SocketEvents';
import { Message as MessagePB } from '../../proto/models';
import { IWsConnector } from '../../socket/WSConnector';
import { BroadCastEventNames } from '../../types/broadCastChannel.types';
import { IOnEvent } from '../../types/common.types';
import { INotSeenCounter, IReadMessageArgs, ISetInitialDataArgs } from '../../types/notSeenCounter.types';
import { INotSeenCounterEvent, NotSeenCounterEmittedEvents } from './const/NotSeenCounterEmittedEvents';

export class NotSeenCounter {
    constructor({
        socket,
        channelId,
        emitter,
    }:INotSeenCounter) {
        this.socket = socket;
        this.emitter = emitter;
        this.channelId = channelId;
    }

    private socket:IWsConnector;

    private channelId:string;

    public notSeenCount = 0;

    private lastSeenMessageCreatedAt:Date|undefined;

    private emitter:EventEmitter;

    private findMessageCb: ((messageId:string) => MessagePB | undefined)|undefined;

    public setFindMessageCb (cb:((messageId:string) => MessagePB | undefined)) {
        this.findMessageCb = cb;
    }

    private countMessageIntervalCb: ((startDate:Date, endDate: Date) => number) | undefined;

    public setCountMessageIntervalCb (cb:((startDate:Date, endDate: Date) => number)) {
        this.countMessageIntervalCb = cb;
    }

    public readMessage({
        messageId
    }:IReadMessageArgs) {
        if (!this.findMessageCb || !this.countMessageIntervalCb) {
            return;
        }

        const message = this.findMessageCb(messageId);

        if (!message?.createdAt) {
            return;
        }

        if (this.lastSeenMessageCreatedAt as Date >= message.createdAt) {
            return;
        }

        this.reCalculateNotSeenCount(message.createdAt);
    };

    public setInitialData({
        notSeenMessagesCount,
        lastSeenMessageCreatedAt,
    }:ISetInitialDataArgs) {
        this.updateNotSeenCount(notSeenMessagesCount);
        this.lastSeenMessageCreatedAt = lastSeenMessageCreatedAt;
    };

    private reCalculateNotSeenCount(newLastSeenCreatedAt:Date) {
        if (this.lastSeenMessageCreatedAt === undefined || !this.countMessageIntervalCb) {
            return;
        }

        const prevLastSeenMessageCreatedAt = this.lastSeenMessageCreatedAt;
        this.lastSeenMessageCreatedAt = newLastSeenCreatedAt;
        this.publishUpdateLastSeenMessage();

        const viewedMessagesCount = this.countMessageIntervalCb(prevLastSeenMessageCreatedAt, newLastSeenCreatedAt);

        if (viewedMessagesCount > 0) {
            this.updateNotSeenCount(this.notSeenCount - viewedMessagesCount);
        }
    }

    private updateNotSeenCount(count:number){
        this.notSeenCount = count;

        const bc = new BroadCast(BroadCastChannels.TabBroadCastChannel);
        bc.publish({
            event: BroadCastEventNames.UpdateChannelNotSeenCount,
            data: {
                count: this.notSeenCount,
                channelId: this.channelId
            }
        });

        this.emit({
            event: NotSeenCounterEmittedEvents.CountUpdated,
            data: {
                count,
            }
        });
    };

    private publishUpdateLastSeenMessage() {
        if (this.lastSeenMessageCreatedAt == undefined) {
            return;
        }
        this.socket.publishMessage({
            $case: OutBoundWsEvents.UpdateLastSeenMessageAtReq,
            [OutBoundWsEvents.UpdateLastSeenMessageAtReq]: {
                channelId: this.channelId,
                lastSeenAtUnixMS: this.lastSeenMessageCreatedAt.getTime(),
            }
        });
    }

    private emit (event:INotSeenCounterEvent) {
        this.emitter?.emit(event.event, event.data);
    }

    public on({ event, cb }:IOnEvent<INotSeenCounterEvent['event'], INotSeenCounterEvent['data']>) {
        this.emitter?.on(event, cb);
    }
}