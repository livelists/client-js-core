import { SocketConnector } from '../socket/SocketConnector';

export class Channel {
    private socket:SocketConnector|undefined;

    public join () {
        this.socket = new SocketConnector();

        console.log('join to room');
    }
}
