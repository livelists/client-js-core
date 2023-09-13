import { CommonError } from '../utils/errors/common.errors';

export enum ConfigErrorCodes {
    UrlShouldContainProtocol= 'urlShouldContainProtocol'
}

export class UrlParseError extends CommonError {
    constructor(message?: string) {
        super(ConfigErrorCodes.UrlShouldContainProtocol, message);
    }
}