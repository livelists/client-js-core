import { Config } from '../../src/config/Config';
import { UrlParseError } from '../../src/config/errors';

let config:Config;
beforeEach(() => {
    config = new Config();
});

it('Config url http should transform to ws', () => {
    config.setUrl('http://localhost:8080');
    expect(config.url).toBe('ws://localhost:8080');
});

it('Config url https should transform to wss', () => {
    config.setUrl('https://localhost:8080');
    expect(config.url).toBe('wss://localhost:8080');
});

it('Config url without protocol should throw error', () => {
    expect(() => config.setUrl('localhost:8080')).toThrow(UrlParseError);
});