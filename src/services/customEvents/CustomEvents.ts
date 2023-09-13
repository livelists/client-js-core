import { EventEmitter } from 'events';

import { InBoundWsEvents, OutBoundWsEvents } from '../../common/const/SocketEvents';
import { CustomEvent } from '../../proto/models';
import { IWsConnector } from '../../socket/WSConnector';
import { IOnEvent } from '../../types/common.types';
import { ICustomEventsArgs } from '../../types/customEvents.types';
import { CustomEventsEmitEvents, ICustomEventsEmittedEvent } from './const/EmittedEvents';

export class CustomEvents {
    constructor({ socket, emitter }:ICustomEventsArgs) {
        this.socket = socket;
        this.emitter = emitter;

        this.socket.subscribe({
            event: InBoundWsEvents.NewCustomEvent,
            cb: this.onCustomEvent.bind(this),
        });
    }

    private socket:IWsConnector|undefined;

    private emitter:EventEmitter;

    public sendCustomEvent(data:CustomEvent) {
        this.socket?.publishMessage({
            $case: OutBoundWsEvents.SendCustomEvent,
            [OutBoundWsEvents.SendCustomEvent]: data,
        });
    }

    private onCustomEvent(data:CustomEvent) {
        console.log('on custom event');
        this.emit({
            event: CustomEventsEmitEvents.NewCustomEvent,
            data,
        });
    }

    private emit (event:ICustomEventsEmittedEvent) {
        this.emitter?.emit(event.event, event.data);
    }

    public on({ event, cb }:IOnEvent<ICustomEventsEmittedEvent['event'], any>) {
        this.emitter?.on(event, cb);
    }
}