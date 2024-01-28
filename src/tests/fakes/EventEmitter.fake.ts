import { EventEmitter } from 'events';

interface IFakeMethods {}

export type IFakeEventEmitter = EventEmitter.EventEmitter & IFakeMethods;


export class FakeEmitter implements IFakeEventEmitter {
    public emit(eventName: string | symbol, ...args: any[]): boolean {
        return true;
    }

    public on(eventName: string | symbol, listener: (...args: any[]) => void): this {
        return this;
    }

    addListener(eventName: string | symbol, listener: (...args: any[]) => void): this {
        return this;
    }

    eventNames(): Array<string | symbol> {
        return [];
    }

    getMaxListeners(): number {
        return 0;
    }

    listenerCount(eventName: string | symbol): number {
        return 0;
    }

    listeners(eventName: string | symbol): Function[] {
        return [];
    }

    off(eventName: string | symbol, listener: (...args: any[]) => void): this {
        return this;
    }

    once(eventName: string | symbol, listener: (...args: any[]) => void): this {
        return this;
    }

    prependListener(eventName: string | symbol, listener: (...args: any[]) => void): this {
        return this;
    }

    prependOnceListener(eventName: string | symbol, listener: (...args: any[]) => void): this {
        return this;
    }

    rawListeners(eventName: string | symbol): Function[] {
        return [];
    }

    removeAllListeners(event: string | symbol | undefined): this {
        return this;
    }

    removeListener(eventName: string | symbol, listener: (...args: any[]) => void): this {
        return this;
    }

    setMaxListeners(n: number): this {
        return this;
    }
}