import Config from '../config/Config';
import { WSConnector } from '../socket/WSConnector';
import { IJoinArgs } from '../types/channel.types';

export class Channel {
    private socket:WSConnector|undefined;

    public join (args:IJoinArgs) {
        Config.setUrl(args.url);

        this.socket = new WSConnector();
        this.socket.openConnection({
            url:  Config.url,
        });

        console.log('join to roomm');
    }
}
