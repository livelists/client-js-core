import Config from '../config/Config';
import { SocketConnector } from '../socket/SocketConnector';
import { IJoinArgs } from '../types/channel.types';

export class Channel {
    private socket:SocketConnector|undefined;

    public join (args:IJoinArgs) {
        Config.setUrl(args.url);
        this.socket = new SocketConnector();
        this.socket.openConnection();

        console.log('join to roomm');
    }
}
