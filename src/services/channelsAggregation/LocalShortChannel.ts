import { EventEmitter } from 'events';

import { ChannelWithMsg } from '../../proto/events';
import { WSConnector } from '../../socket/WSConnector';
import { ILocalShortChannelArgs } from '../../types/localShortChannel.types';

export class LocalShortChannel {
    constructor({
        socket,
        emitter,
        channel,
    }:ILocalShortChannelArgs) {
        this.socket = socket;
        this.emitter = emitter;
        this.channel = channel;
        this.wrapChannelFromServer(channel);
    }

    private emitter:EventEmitter;

    private socket:WSConnector|undefined;

    public unreadCount:number = 0;

    public channel:ChannelWithMsg;

    private wrapChannelFromServer(ch:ChannelWithMsg) {
        this.unreadCount = 2;
    }
}