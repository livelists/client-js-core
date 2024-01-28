import { EventEmitter } from 'events';

import { ChannelEvents, IIsLoadingMoreUpdated } from './const/EmittedEvents';

export class ListLoader {
    constructor(emitter:EventEmitter) {
        this.emitter = emitter;
    }

    private emitter:EventEmitter;
    
    private _isPrevLoadingMore = false;

    private _isNextLoadingMore = false;

    private _firstMessageCreatedAt:Date|undefined = undefined;

    private _lastMessageCreatedAt:Date|undefined = undefined;

    private isLastWasLoaded:boolean = false;

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

    public set firstMessageCreatedAt(date:Date | undefined) {
        this._firstMessageCreatedAt = date;
    }

    public set lastMessageCreatedAt(date:Date | undefined) {
        this._lastMessageCreatedAt = date;
    }

    public checkIsCanLoadMore({
        isPrevLoading,
        firstLoadedCreatedAt,
        lastLoadedCreatedAt
    }:{
        isPrevLoading: boolean,
        firstLoadedCreatedAt: Date,
        lastLoadedCreatedAt: Date,
    }):boolean {
        if (this.isLoading({ isPrev: isPrevLoading })) {
            return false;
        }

        if (isPrevLoading && firstLoadedCreatedAt <= (this._firstMessageCreatedAt || 0)) {
            return false;
        }

        if (!isPrevLoading && this.isLastWasLoaded) {
            return false;
        }

        if (!isPrevLoading && lastLoadedCreatedAt >= (this._lastMessageCreatedAt || 0)) {
            this.isLastWasLoaded = true;
            return false;
        }
        return true;
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