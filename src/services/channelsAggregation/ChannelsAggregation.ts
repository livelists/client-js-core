import { EventEmitter } from 'events';

import { InBoundWsEvents, OutBoundWsEvents } from '../../common/const/SocketEvents';
import { LoadChannelsWithMsgRes } from '../../proto/events';
import { WSConnector } from '../../socket/WSConnector';
import { IChannelsAggregationArgs, ILoadChannelsArgs, } from '../../types/channelsAggregation.types';
import { IOnEvent } from '../../types/common.types';
import { ChannelsAggregationEvents, IChannelsAggregationEmittedEvent, } from './const/EmittedEvents';
import { LocalShortChannel } from './LocalShortChannel';


export class ChannelsAggregation {
    constructor({
        socket,
    }:IChannelsAggregationArgs) {
        this.socket = socket;
        this.emitter = new EventEmitter();

        this.socket.subscribe({
            event: InBoundWsEvents.LoadChannelsWithMsgRes,
            cb: this.onLoadChannels.bind(this),
        });
    }

    private emitter:EventEmitter;

    private emit (event:IChannelsAggregationEmittedEvent) {
        this.emitter?.emit(event.event, event.data);
    }
    
    private socket:WSConnector|undefined;

    private channels:LocalShortChannel[] = [];

    private messagesLimit:number|undefined;

    public loadMyChannels(args:ILoadChannelsArgs) {
        this.messagesLimit = args.messagesLimit;
        this.socket?.publishMessage({
            $case: OutBoundWsEvents.LoadChannelsWithMsgReq,
            [OutBoundWsEvents.LoadChannelsWithMsgReq]: {
                messagesLimit: args.messagesLimit,
            }
        });
    }

    private onLoadChannels(args:LoadChannelsWithMsgRes) {
        this.channels = args.channels.map((c) => new LocalShortChannel({
            socket: this.socket as WSConnector,
            emitter: this.emitter,
            channel: c,
            messagesLimit: this.messagesLimit,
        }));

        this.emitChannelsListUpdated();
    }

    private emitChannelsListUpdated() {
        this.emit({
            event: ChannelsAggregationEvents.ChannelsListUpdated,
            data: {
                channels: this.channels
            }
        });
    }
    
    public on({ event, cb }:IOnEvent<IChannelsAggregationEmittedEvent['event'], any>) {
        this.emitter?.on(event, cb);
    }
}