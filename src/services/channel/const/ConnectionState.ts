export enum ConnectionStates {
    Disconnected = 'disconnected',
    Connecting = 'connecting',
    Connected = 'connected',
    ConnectionError = 'connectionError',
}

export type ConnectionState = `${ConnectionStates}`;
