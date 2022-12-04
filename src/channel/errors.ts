import { CommonError } from '../utils/errors/common.errors';

enum ErrorCodes {
    ConnectionError = 'connectionError',
}

export class ConnectionError extends CommonError {
    constructor(message?: string) {
        super(ErrorCodes.ConnectionError, message);
    }
}
