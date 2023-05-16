import { ChannelParticipantGrants } from '../proto/models';
import { CustomData } from './common.types';
export interface ILocalParticipantArgs {
    identifier: string,
    customData: CustomData,
    grants: ChannelParticipantGrants,
}
