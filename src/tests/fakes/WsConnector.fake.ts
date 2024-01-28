import { InBoundWsEvents } from '../../common/const/SocketEvents';
import {
    InBoundMessage,
    OutBoundMessage,
} from '../../proto/events';
import { IWsConnector } from '../../socket/WSConnector';
import { IOpenConnectionArgs, ISubscribeArgs } from '../../types/websocket.types';

type OutBoundMessageData = OutBoundMessage['message']

interface IFakeMethods {
    sendMessageFake: (message:InBoundMessage) => void,
    subscriptions: Record<string, ISubscribeArgs['cb'][]>,
}

export type IFakeWsConnect = IWsConnector & IFakeMethods;

export class FakeWSConnector implements IFakeWsConnect {
    public isConnected:boolean = false;

    public subscriptions: Record<string, ISubscribeArgs['cb'][]> = {};

    public openConnection (args:IOpenConnectionArgs):Promise<void|InBoundMessage> {
        return new Promise<void|InBoundMessage>((resolve) => {
            this.isConnected = true;
            resolve();
        });
    }

    public publishMessage (message:OutBoundMessageData) {

    }

    public subscribe (args:ISubscribeArgs) {
        const prevListeners = this.subscriptions[args.event];
        if (!prevListeners) {
            this.subscriptions[args.event] = [args.cb];
        } else {
            this.subscriptions[args.event] = [...this.subscriptions[args.event], args.cb];
        }
    };

    public unSubscribe (args:ISubscribeArgs) {
        const handlersCopy = [...this.subscriptions[args.event]];
        if (handlersCopy) {
            const deleteIndex = handlersCopy.findIndex((cb) => cb === args.cb);
            if (deleteIndex !== -1) {
                handlersCopy.splice(deleteIndex, 1);
                this.subscriptions[args.event] = handlersCopy;
            }
        }
    }

    public sendMessageFake = (message:InBoundMessage) => {
        const event = message.message?.$case;
        if (!event) {
            return;
        }
        switch (event) {
            case InBoundWsEvents.NewMessage:
                this.callListeners({
                    event: event as InBoundWsEvents,
                    data: message.message?.newMessage,
                });
                break;
            case InBoundWsEvents.MeJoinedToChannel:
                this.callListeners({
                    event: event as InBoundWsEvents,
                    data: message.message?.meJoinedToChannel,
                });
                break;
            case InBoundWsEvents.LoadMoreMessagesRes:
                this.callListeners({
                    event: event as InBoundWsEvents,
                    data: message.message?.loadMoreMessagesRes,
                });
                break;
            case InBoundWsEvents.LoadParticipantsRes:
                this.callListeners({
                    event: event as InBoundWsEvents,
                    data: message.message?.loadParticipantsRes,
                });
                break;
            case InBoundWsEvents.ParticipantBecameOnline:
                this.callListeners({
                    event: event as InBoundWsEvents,
                    data: message.message?.participantBecameOnline,
                });
                break;
            case InBoundWsEvents.ParticipantBecameOffline:
                this.callListeners({
                    event: event as InBoundWsEvents,
                    data: message.message?.participantBecameOffline,
                });
                break;
            case InBoundWsEvents.NewCustomEvent:
                this.callListeners({
                    event: event as InBoundWsEvents,
                    data: message.message?.newCustomEvent,
                });
                break;
            case InBoundWsEvents.LoadChannelsWithMsgRes:
                this.callListeners({
                    event: event as InBoundWsEvents,
                    data: message.message?.loadChannelsWithMsgRes,
                });
                break;
        }
    };

    private callListeners = ({ event, data }:{ event: InBoundWsEvents, data: any }) => {
        this.subscriptions[event]?.map((cb) => cb(data));
    };
}
