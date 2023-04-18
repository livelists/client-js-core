import { InBoundWsEvents } from '../common/const/SocketEvents';
import Config from '../config/Config';
import { logger } from '../config/logger';
import { InBoundMessage, MeJoinedToChannel, OutBoundMessage } from '../proto/events';
import { Message } from '../proto/models';
import { ConnectionError } from '../services/channel/errors';
import { IOpenConnectionArgs } from '../types/websocket.types';

type OutBoundMessageData = OutBoundMessage['message']

type ISubscribeArgs = {
    event: InBoundWsEvents.MeJoinedToChannel,
    cb: (args:MeJoinedToChannel) => void,
} | {
    event: InBoundWsEvents.NewMessage,
    cb: (args: Message) => void,
}

export class WSConnector {
    private ws?:WebSocket;

    private isConnected:boolean = false;

    private useJSON: boolean = false;

    private subscriptions: Record<string, ISubscribeArgs['cb'][]> = {};

    static handleWSError(ev: Event) {
        logger.error('websocket error', ev);
    }

    public openConnection (args:IOpenConnectionArgs) {
        logger.info('open connection');
        logger.info(Config.url);

        this.ws = undefined;
        const ws = new WebSocket(`${args.url}/?accessToken=${args.authToken}`);
        this.ws = ws;
        this.ws.binaryType = 'arraybuffer';

        return new Promise<void|InBoundMessage>((resolve, reject) => {
            ws.onerror = async (ev: Event) => {
                if (!this.ws) {
                    try {
                        const resp = await fetch(`http${args.url.substring(2)}/?accessToken=${args.authToken}`);
                        if (!resp.ok) {
                            const msg = await resp.text();
                            reject(new ConnectionError(msg));
                        } else {
                            reject(new ConnectionError('Internal error'));
                        }
                    } catch (e) {
                        reject(new ConnectionError('server was not reachable'));
                    }
                    return;
                }
                WSConnector.handleWSError(ev);
            };

            ws.onopen = () => {
                this.ws = ws;
                resolve();
            };

            ws.onmessage = async (ev: MessageEvent) => {
                let resp: InBoundMessage;
                if (typeof ev.data === 'string') {
                    const json = JSON.parse(ev.data);
                    resp = InBoundMessage.fromJSON(json);
                } else if (ev.data instanceof ArrayBuffer || typeof ev.data === 'object') {
                    resp = InBoundMessage.decode(new Uint8Array(ev.data));
                } else {
                    logger.error(`could not decode websocket message: ${typeof ev.data}`);
                    return;
                }

                this.messageHandler(resp);

                if (!this.isConnected) {
                    // handle join message only
                    if (resp.message?.$case == InBoundWsEvents.MeJoinedToChannel) {
                        this.isConnected = true;
                        resolve(resp);
                    } else {
                        reject(new ConnectionError('did not receive join response'));
                    }
                    return;
                }
            };

            ws.onclose = (ev: CloseEvent) => {
                if (!this.isConnected || this.ws !== ws) return;

                logger.debug(`websocket connection closed: ${ev.reason}`);
                this.isConnected = false;
                if (this.ws === ws) {
                    this.ws = undefined;
                }
            };
        });
    }

    public publishMessage (message:OutBoundMessageData) {
        const req = {
            message,
        };

        if (!this.ws || this.ws.readyState !== this.ws.OPEN) {
            logger.error(`cannot send signal request before connected, type: ${message?.$case}`);
            return;
        }

        try {
            if (this.useJSON) {
                this.ws.send(JSON.stringify(OutBoundMessage.toJSON(req)));
            } else {
                this.ws.send(OutBoundMessage.encode(req).finish());
            }
        } catch (e) {
            logger.error('error sending signal message', { error: e });
        }
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

    private messageHandler = (message:InBoundMessage) => {
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
        }
    };

    private callListeners = ({ event, data }:{ event: InBoundWsEvents, data: any }) => {
        this.subscriptions[event]?.map((cb) => cb(data));
    };
}
