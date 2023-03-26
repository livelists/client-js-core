import Config from '../config/Config';
import { WSEvents } from '../contracts/socketEvents';
import { WSConnector } from '../socket/WSConnector';
import { IJoinArgs, IPublishMessage } from '../types/channel.types';
import { ConnectionState, ConnectionStates } from './const/ConnectionState';

export class Channel {
    private socket:WSConnector|undefined;

    public connectionState:ConnectionState = ConnectionStates.Disconnected;

    public channelId:string|undefined = undefined;

    public async join (args:IJoinArgs) {
        Config.setUrl(args.url);

        this.socket = new WSConnector();
        this.channelId = args.channelId;

        this.connectionState = ConnectionStates.Connecting;
        const result = await this.socket.openConnection({
            url:  Config.url,
        });

        if (result) {
            this.connectionState = ConnectionStates.Connected;
        } else {
            this.connectionState = ConnectionStates.ConnectionError;
        }

        this.socket.sendMessage({
            message: {
                event: WSEvents.ChannelJoin,
                room: {
                    channelId: args.channelId,
                },
                data: {},
            }
        });
    }

    public async publishMessage(args:IPublishMessage) {
        this.socket?.sendMessage({
            message: {
                event: WSEvents.SendMessage,
                room: {
                    channelId: this.channelId,
                },
                data: {
                    text: args.text,
                }
            }
        });
    }
}
