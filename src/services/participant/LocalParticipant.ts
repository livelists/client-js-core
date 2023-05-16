import { ChannelParticipantGrants } from '../../proto/models';
import { CustomData } from '../../types/common.types';
import { ILocalParticipantArgs } from '../../types/participant.types';

export class LocalParticipant {
    constructor({ identifier, customData, grants }:ILocalParticipantArgs) {
        this._identifier = identifier;
        this._customData = customData;
        this._grants = grants;
    }

    private readonly _identifier:string = '';

    private readonly _customData:CustomData = undefined;

    private readonly _grants:ChannelParticipantGrants|undefined = undefined;

    get identifier():string {
        return this._identifier;
    }

    get customData():CustomData {
        return this._customData;
    }

    get grants():ChannelParticipantGrants|undefined {
        return this._grants;
    }
}
