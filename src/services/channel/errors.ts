import { CommonError } from '../../utils/errors/common.errors';

export enum ChannelErrorCodes {
    ConnectionError = 'connectionError',
    MyLocalParticipantNotExist = 'myLocalParticipantNotExist ',
    LoadMoreMessagesError = 'loadMoreMessagesError',
}

export class ConnectionError extends CommonError {
    constructor(message?: string) {
        super(ChannelErrorCodes.ConnectionError, message);
    }
}

export class MyLocalParticipantNotExistError extends CommonError {
    constructor(message?: string) {
        super(ChannelErrorCodes.MyLocalParticipantNotExist, message);
    }
}

export class LoadMoreMessagesError extends CommonError {
    constructor(message?: string) {
        super(ChannelErrorCodes.LoadMoreMessagesError, message);
    }
}
