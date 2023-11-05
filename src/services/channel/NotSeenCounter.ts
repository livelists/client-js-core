import { EventEmitter } from 'events';

import { OutBoundWsEvents } from '../../common/const/SocketEvents';
import { Message as MessagePB } from '../../proto/models';
import { IWsConnector } from '../../socket/WSConnector';
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

    public readMessage({
        messageId
    }:IReadMessageArgs) {
        if (!this.findMessageCb) {
            return;
        }

        const message = this.findMessageCb(messageId);

        if (!message?.createdAt) {
            return;
        }

        if (this.lastSeenMessageCreatedAt == undefined) {
            this.lastSeenMessageCreatedAt = message.createdAt;
            this.publishUpdateLastSeenMessage();
        }

        if (this.lastSeenMessageCreatedAt >= message.createdAt) {
            return;
        }

        this.lastSeenMessageCreatedAt = message.createdAt;
        this.publishUpdateLastSeenMessage();
    };

    public setInitialData({
        notSeenMessagesCount,
        lastSeenMessageCreatedAt,
    }:ISetInitialDataArgs) {
        const bc = new BroadcastChannel('test_channel');
        bc.postMessage({
            message: 'info'
        });

        this.updateNotSeenCount(notSeenMessagesCount);
        this.lastSeenMessageCreatedAt = lastSeenMessageCreatedAt;
    };


    private updateNotSeenCount(count:number){
        this.notSeenCount = count;
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