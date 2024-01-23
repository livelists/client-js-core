import { EventEmitter } from 'events';

import { ChannelEvents, IIsLoadingMoreUpdated } from './const/EmittedEvents';

export class ListLoader {
    constructor(emitter:EventEmitter) {
        this.emitter = emitter;
    }

    private emitter:EventEmitter;
    
    private _isPrevLoadingMore = false;

    private _isNextLoadingMore = false;

    public isLoading({ isPrev }:{ isPrev:boolean }) {
        if (isPrev) {
            return this.isPrevLoadingMore;
        } else {
            return this.isNextLoadingMore;
        }
    }

    public get isPrevLoadingMore() {
        return this._isPrevLoadingMore;
    }
    
    public get isNextLoadingMore() {
        return this._isNextLoadingMore;
    }

    public updateIsLoadingMore({
        isPrevLoading,
        isLoading
    }:{
        isPrevLoading: boolean,
        isLoading:boolean
    }) {
        if (isPrevLoading) {
            this.updateIsPrevLoadingMore(isLoading);
        } else {
            this.updateIsNextLoadingMore(isLoading);
        }
    }

    private updateIsPrevLoadingMore(isLoadingMore:boolean) {
        this._isPrevLoadingMore = isLoadingMore;
        this.emitIsLoadingMore(isLoadingMore, true);
    }

    private updateIsNextLoadingMore(isLoadingMore:boolean) {
        this._isNextLoadingMore = isLoadingMore;
        this.emitIsLoadingMore(isLoadingMore, false);
    }

    private emitIsLoadingMore(isLoadingMore:boolean, isPrevLoading:boolean) {
        this.emit({
            event: ChannelEvents.IsLoadingMoreUpdated,
            data: {
                isLoadingMore,
                isPrevLoading,
            }
        });
    }

    private emit (event:IIsLoadingMoreUpdated) {
        this.emitter?.emit(event.event, event.data);
    }
}