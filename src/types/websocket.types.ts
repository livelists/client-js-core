import { IWSEvent } from '../contracts/socketEvents';

export interface IOpenConnectionArgs {
    url: string,
}

export interface ISendMessageArgs {
    message: IWSEvent<any, any>,
}
