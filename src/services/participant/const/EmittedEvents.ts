import { ParticipantShortInfo } from '../../../proto/models';

export enum ChannelParticipantsEvents {
    ParticipantBecameOnline = 'participantBecameOnline',
    ParticipantBecameOffline = 'participantBecameOffline',
    ParticipantsListUpdated = 'participantsListUpdated',
    ParticipantsListLoaded = 'participantsListLoaded'
}

export interface IParticipantBecameOnline {
    event: ChannelParticipantsEvents.ParticipantBecameOnline,
    data: {
        participantUserId: number,
    }
}

export interface IParticipantBecameOffline {
    event: ChannelParticipantsEvents.ParticipantBecameOffline,
    data: {
        participantUserId: number,
    }
}

export interface IParticipantsUpdated {
    event: ChannelParticipantsEvents.ParticipantsListUpdated,
    data: {
        participants: ParticipantShortInfo[],
    }
}

export interface IParticipantsLoaded {
    event: ChannelParticipantsEvents.ParticipantsListLoaded,
    data: {
        isLoaded: true,
    }
}

export type IChannelParticipantsEmittedEvent =
    IParticipantBecameOnline | IParticipantBecameOffline | IParticipantsUpdated | IParticipantsLoaded;