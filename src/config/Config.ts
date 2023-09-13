import { UrlParseError } from './errors';

export class Config {
    url: string = '';

    accessToken: string = '';

    public setUrl (url:string) {
        if (url.startsWith('https')) {
            this.url = url.replace('https', 'wss');
        } else if (url.startsWith('http')) {
            this.url = url.replace('http', 'ws');
        } else {
            throw new UrlParseError('Url should contain http or https protocol');
        }
    }

    public setAccessToken(token:string) {
        this.accessToken = token;
    }
}

export const ConfigInstance = new Config();
