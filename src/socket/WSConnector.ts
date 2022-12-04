import { ConnectionError } from '../channel/errors';
import Config from '../config/Config';
import { logger } from '../config/logger';
import { IWSResponse, WSEvents, WSResponse } from '../contracts/socketEvents';
import { IOpenConnectionArgs, ISendMessageArgs } from '../types/websocket.types';

export class WSConnector {
    private ws?:WebSocket;

    private isConnected:boolean = false;

    static handleWSError(ev: Event) {
        logger.error('websocket error', ev);
    }

    public openConnection (args:IOpenConnectionArgs) {
        logger.info('open connection');
        logger.info(Config.url);

        this.ws = undefined;
        const ws = new WebSocket(args.url);

        return new Promise<void|IWSResponse>((resolve, reject) => {
            ws.onerror = async (ev: Event) => {
                if (!this.ws) {
                    try {
                        const resp = await fetch(`http${args.url.substring(2)}`);
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
                let resp: IWSResponse;
                if (typeof ev.data === 'string') {
                    const json = JSON.parse(ev.data);
                    resp = WSResponse.fromJSON(json);
                } else {
                    logger.error(`could not decode websocket message: ${typeof ev.data}`);
                    return;
                }

                if (!this.isConnected) {
                    // handle join message only
                    if (resp.message?.event === WSEvents.ChannelJoin) {
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

    public sendMessage (args:ISendMessageArgs) {
        this.ws?.send(JSON.stringify(args.message));
    }
}
