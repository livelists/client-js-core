import { EventEmitter } from 'events';

import { InBoundWsEvents, OutBoundWsEvents } from '../../common/const/SocketEvents';
import { LoadParticipantsRes, ParticipantBecameOffline, ParticipantBecameOnline, } from '../../proto/events';
import { ParticipantShortInfo } from '../../proto/models';
import { WSConnector } from '../../socket/WSConnector';
import { IChannelParticipantsArgs } from '../../types/participant.types';
import { ChannelParticipantsEvents, IChannelParticipantsEmittedEvent, IOnEvent } from './const/EmittedEvents';

export class ChannelParticipants {
    constructor({ socket, emitter }:IChannelParticipantsArgs) {
        this.socket = socket;
        this.emitter = emitter;

        this.socket.subscribe({
            event: InBoundWsEvents.LoadParticipantsRes,
            cb: this.onLoadParticipantsRes.bind(this),
        });
        this.socket.subscribe({
            event: InBoundWsEvents.ParticipantBecameOnline,
            cb: this.onParticipantBecameOnline.bind(this)
        });
        this.socket.subscribe({
            event: InBoundWsEvents.ParticipantBecameOffline,
            cb: this.onParticipantBecameOffline.bind(this)
        });
    }

    private isParticipantsLoaded:boolean = false;

    private participantsList:ParticipantShortInfo[] = [];
    
    private socket:WSConnector|undefined;

    private emitter:EventEmitter;

    public loadParticipants() {
        this.socket?.publishMessage({
            $case: OutBoundWsEvents.LoadParticipantsReq,
            [OutBoundWsEvents.LoadParticipantsReq]: {
                pageSize: 1000,
            },
        });
    }

    private onLoadParticipantsRes(data:LoadParticipantsRes) {
        this.updateIsParticipantsUploaded();
        this.participantsList = data.participants;
        this.emitParticipantsListUpdated();
    }

    private emitParticipantsListUpdated() {
        this.emit({
            event: ChannelParticipantsEvents.ParticipantsListUpdated,
            data: {
                participants: this.participantsList,
            }
        });
    }

    private updateIsParticipantsUploaded() {
        this.isParticipantsLoaded = true;
        this.emitIsParticipantsUploaded();
    }

    private emitIsParticipantsUploaded() {
        this.emit({
            event: ChannelParticipantsEvents.ParticipantsListLoaded,
            data: {
                isLoaded: true,
            }
        });
    }

    private onParticipantBecameOnline(data:ParticipantBecameOnline) {
        const becameOnlineIndex = this.participantsList.findIndex(
            (p) => p.identifier == data.identifier);

        if (becameOnlineIndex != -1) {
            const participantsListCopy = [...this.participantsList];
            const participantCopy = { ...participantsListCopy[becameOnlineIndex] };
            participantCopy.isOnline = true;
            participantsListCopy[becameOnlineIndex] = participantCopy;
            this.participantsList[becameOnlineIndex] = participantCopy;
            this.emitParticipantsListUpdated();
        }
    }

    private onParticipantBecameOffline(data:ParticipantBecameOffline) {
        const becameOfflineIndex = this.participantsList.findIndex(
            (p) => p.identifier == data.identifier);

        if (becameOfflineIndex != -1) {
            const participantsListCopy = [...this.participantsList];
            const participantCopy = { ...participantsListCopy[becameOfflineIndex] };
            participantCopy.isOnline = false;
            participantCopy.lastSeenAt = data.lastSeenAt;
            participantsListCopy[becameOfflineIndex] = participantCopy;
            this.participantsList[becameOfflineIndex] = participantCopy;

            this.emitParticipantsListUpdated();
        }
    }

    private emit (event:IChannelParticipantsEmittedEvent) {
        this.emitter?.emit(event.event, event.data);
    }

    public on({ event, cb }:IOnEvent<IChannelParticipantsEmittedEvent['event'], any>) {
        this.emitter?.on(event, cb);
    }
}