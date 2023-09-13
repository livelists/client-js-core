import { EventEmitter } from 'events';

import { InBoundWsEvents } from '../../common/const/SocketEvents';
import { ChannelWithMsg } from '../../proto/events';
import { Message as MessagePB } from '../../proto/models';
import { IWsConnector } from '../../socket/WSConnector';
import { IShortChannelData } from '../../types/channelsAggregation.types';
import { ILocalShortChannelArgs } from '../../types/localShortChannel.types';

export class LocalShortChannel {
    constructor({
        socket,
        emitter,
        channel,
        messagesLimit,
    }:ILocalShortChannelArgs) {
        this.socket = socket;
        this.emitter = emitter;
        this.channel = channel;
        this.wrapChannelFromServer(channel);
        this.messagesLimit = messagesLimit;

        this.socket.subscribe({
            event: InBoundWsEvents.NewMessage,
            cb: this.onNewMessage.bind(this),
        });
    }

    private messagesLimit:number|undefined;

    private emitter:EventEmitter;

    private onUpdatedCb:(({
        channel,
        unreadCount
    }:IShortChannelData) => void) | undefined;

    private socket:IWsConnector|undefined;

    public unreadCount:number = 0;

    public channel:ChannelWithMsg;

    public onUpdated({ cb }:{ cb: ({
        channel,
        unreadCount
    }:IShortChannelData) => void}) {
        this.onUpdatedCb = cb;
    }

    public updateChannelLastMessage({
        message
    }:{
        message: MessagePB,
    }) {
        const updatesMessages = [message, ...this.channel.messages];
        this.channel.messages = updatesMessages.slice(0, this.messagesLimit);
    }

    private wrapChannelFromServer(ch:ChannelWithMsg) {
        this.unreadCount = 2;
    }

    private onNewMessage(args:MessagePB) {
        if (args.channelIdentifier === this.channel.channel?.identifier) {
            this.updateChannelLastMessage({
                message: args,
            });
            this.callChannelUpdated();
        }
    }

    private callChannelUpdated = () => {
        if (this.onUpdatedCb) {
            this.onUpdatedCb({
                channel: this.channel,
                unreadCount: this.unreadCount,
            });
        }
    };
}