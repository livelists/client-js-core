import { ErrorCodes } from './websocket.errors';

type ErrorType = ErrorCodes;

export class CommonError extends Error {
    code: ErrorType;

    constructor(code: ErrorType, message?: string) {
        super(message || 'an error has occured');
        this.code = code;
    }
}
