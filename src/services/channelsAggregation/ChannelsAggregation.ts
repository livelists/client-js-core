import { EventEmitter } from 'events';

import { InBoundWsEvents, OutBoundWsEvents } from '../../common/const/SocketEvents';
import { LoadChannelsWithMsgRes } from '../../proto/events';
import { IWsConnector, WSConnector } from '../../socket/WSConnector';
import { IChannelsAggregationArgs, ILoadChannelsArgs } from '../../types/channelsAggregation.types';
import { IOnEvent } from '../../types/common.types';
import { NotSeenCounterEmittedEvents } from '../channel/const/NotSeenCounterEmittedEvents';
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

        this.emitter.addListener(NotSeenCounterEmittedEvents.CountUpdated, (data:any) => {
            console.log(data, 'counter inside aggr');
        });

        const bc = new BroadcastChannel('test_channel');

        bc.onmessage = (event) => {

        };
    }

    private emitter:EventEmitter;

    private emit (event:IChannelsAggregationEmittedEvent) {
        this.emitter?.emit(event.event, event.data);
    }
    
    private socket:IWsConnector|undefined;

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
        const notSortedChannels = args.channels.map((c) => new LocalShortChannel({
            socket: this.socket as WSConnector,
            emitter: this.emitter,
            channel: c,
            messagesLimit: this.messagesLimit,
        }));

        notSortedChannels.map((ch) => ch.onUpdated({
            cb: this.onChannelUpdated.bind(this),
        }));

        this.channels = this.sortChannelByDates(notSortedChannels);

        this.emitChannelsListUpdated();
    }

    private sortChannelByDates(channels:LocalShortChannel[]):LocalShortChannel[] {
        return [...channels].sort((firstChannel:LocalShortChannel, secondChannel:LocalShortChannel) => {
            const firstChMessages = firstChannel.channel.messages;
            const secondChMessages = secondChannel.channel.messages;

            const channel1Date = firstChMessages.length > 0 ? firstChMessages[firstChMessages.length - 1]?.createdAt : firstChannel.channel.channel?.createdAt;
            const channel2Date = secondChMessages.length > 0 ? secondChMessages[secondChMessages.length - 1]?.createdAt : secondChannel.channel.channel?.createdAt;

            if (!channel1Date) {
                return 1;
            } else if (!channel2Date) {
                return -1;
            } else if (channel1Date && channel2Date) {
                return channel2Date.getTime() - channel1Date.getTime();
            }
            return 0;
        });
    }

    private onChannelUpdated() {
        const newSort = this.sortChannelByDates(this.channels);

        if (
            this.channels.map((ch) => ch.channel.channel?.id).toString() !==
            newSort.map((ch) => ch.channel.channel?.id).toString()
        ) {
            this.channels = newSort;
            this.emitChannelsListUpdated();
        }
    };

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