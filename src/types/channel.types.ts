export interface IJoinArgs {
    url: string,
    accessToken: string,
}

export interface IPublishMessage {
    text: string,
    customData?: Record<string, string>,
}
