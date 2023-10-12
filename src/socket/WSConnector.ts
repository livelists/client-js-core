import { InBoundWsEvents } from '../common/const/SocketEvents';
import { ConfigInstance } from '../config/Config';
import { logger } from '../config/logger';
import {
    InBoundMessage,
    OutBoundMessage,
} from '../proto/events';
import { ConnectionError } from '../services/channel/errors';
import { IOpenConnectionArgs, ISubscribeArgs } from '../types/websocket.types';

type OutBoundMessageData = OutBoundMessage['message']


export interface IWsConnector {
    isConnected:boolean,
    openConnection: (args:IOpenConnectionArgs) => Promise<void|InBoundMessage>,
    publishMessage: (message:OutBoundMessageData) => void,
    subscribe: (args:ISubscribeArgs) => void,
    unSubscribe: (args:ISubscribeArgs) => void,
}

export class WSConnector implements  IWsConnector {
    private ws?:WebSocket;

    public isConnected:boolean = false;

    private useJSON: boolean = false;

    private static pingTimeOut: number = 1000;

    private pingInterval:any;

    private pingTimeout:any;

    private pingIntervalDuration: number = 5000;

    private pingTimeoutDuration: number = 2000;

    private subscriptions: Record<string, ISubscribeArgs['cb'][]> = {};

    static handleWSError(ev: Event) {
        logger.error('websocket error', ev);
    }

    public openConnection (args:IOpenConnectionArgs):Promise<void|InBoundMessage> {
        ConfigInstance.setUrl(args.url);
        ConfigInstance.setAccessToken(args.authToken);

        logger.info('open connection');
        logger.info(ConfigInstance.url);

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
                this.isConnected = true;
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
            case InBoundWsEvents.ChannelLastSeenMessageUpdated:
                this.callListeners({
                    event: event as InBoundWsEvents,
                    data: message.message?.channelLastSeenMessageUpdated,
                });
                break;
            case InBoundWsEvents.UpdateLastSeenMessageAtRes:
                this.callListeners({
                    event: event as InBoundWsEvents,
                    data: message.message?.updateLastSeenMessageAtRes,
                });
                break;
        }
    };

    sendPing() {
        /** send both of ping and pingReq for compatibility to old and new server */
        /*return Promise.all([
            this.sendRequest({
                $case: 'ping',
                ping: Date.now(),
            }),
            this.sendRequest({
                $case: 'pingReq',
                pingReq: {
                    timestamp: Date.now(),
                    rtt: this.rtt,
                },
            }),
        ]);*/
    }

    private resetPingTimeout() {
        this.clearPingTimeout();
        if (!this.pingTimeoutDuration) {
            console.log('ping timeout duration not set');
            return;
        }
        this.pingTimeout = setTimeout(() => {
            console.log(
                `ping timeout triggered. last pong received at: ${new Date(
                    Date.now() - this.pingTimeoutDuration! * 1000,
                ).toUTCString()}`,
            );
        }, this.pingTimeoutDuration * 1000);
    }

    /**
     * Clears ping timeout (does not start a new timeout)
     */
    private clearPingTimeout() {
        if (this.pingTimeout) {
            clearTimeout(this.pingTimeout);
        }
    }

    private startPingInterval() {
        this.clearPingInterval();
        this.resetPingTimeout();
        if (!this.pingIntervalDuration) {
            console.log('ping interval duration not set');
            return;
        }
        console.log('start ping interval');
        this.pingInterval = setInterval(() => {
            this.sendPing();
        }, this.pingIntervalDuration * 1000);
    }

    private clearPingInterval() {
        this.clearPingTimeout();
        if (this.pingInterval) {
            clearInterval(this.pingInterval);
        }
    }

    private callListeners = ({ event, data }:{ event: InBoundWsEvents, data: any }) => {
        this.subscriptions[event]?.map((cb) => cb(data));
    };
}
