import { IWSEvent } from '../contracts/socketEvents';

export interface IOpenConnectionArgs {
    url: string,
    authToken: string,
}

export interface ISendMessageArgs {
    message: IWSEvent<any, any>,
}
