import { BroadCastChannels } from '../common/const/BroadCastChannels';
import { BroadCastEvents, OnBroadCastEvents } from '../types/broadCastChannel.types';

export class BroadCast {
    constructor(channelName: BroadCastChannels) {
        this.bcChannel = new BroadcastChannel(channelName);

        this.bcChannel.onmessage = (data:MessageEvent<BroadCastEvents>) => {
            this.callListeners(data.data);
        };
    }

    private bcChannel:BroadcastChannel;

    public publish = (event:BroadCastEvents) => {
        this.bcChannel.postMessage(event);
    };

    private subscriptions: Record<string, OnBroadCastEvents['cb'][]> = {};

    public subscribe (args:OnBroadCastEvents) {
        const prevListeners = this.subscriptions[args.event];
        if (!prevListeners) {
            this.subscriptions[args.event] = [args.cb];
        } else {
            this.subscriptions[args.event] = [...this.subscriptions[args.event], args.cb];
        }
    };

    public unSubscribe (args:OnBroadCastEvents) {
        const handlersCopy = [...this.subscriptions[args.event]];
        if (handlersCopy) {
            const deleteIndex = handlersCopy.findIndex((cb) => cb === args.cb);
            if (deleteIndex !== -1) {
                handlersCopy.splice(deleteIndex, 1);
                this.subscriptions[args.event] = handlersCopy;
            }
        }
    }

    private callListeners = (event:BroadCastEvents) => {
        this.subscriptions[event.event]?.map((cb) => cb(event.data));
    };
}