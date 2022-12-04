import Config from '../config/Config';
import { WSEvents } from '../contracts/socketEvents';
import { WSConnector } from '../socket/WSConnector';
import { IJoinArgs } from '../types/channel.types';

export class Channel {
    private socket:WSConnector|undefined;

    public async join (args:IJoinArgs) {
        Config.setUrl(args.url);

        this.socket = new WSConnector();

        await this.socket.openConnection({
            url:  Config.url,
        });

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
}
