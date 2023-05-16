import { ChannelErrorCodes } from '../../services/channel/errors';
import { ErrorCodes } from './websocket.errors';

type ErrorType = ErrorCodes | ChannelErrorCodes;

export class CommonError extends Error {
    code: ErrorType;

    constructor(code: ErrorType, message?: string) {
        super(message || 'an error has occured');
        this.code = code;
    }
}
