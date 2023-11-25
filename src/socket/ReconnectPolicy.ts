import { logger } from '../config/logger';

export abstract class ReconnectPolicy {
    abstract onReTry({
        attemptNumber,
        onCallRetry,
    }:{
        attemptNumber: number,
        onCallRetry: () => void
    }):void
}


export class DefaultReconnectPolicy implements ReconnectPolicy{
    onReTry({
        attemptNumber,
        onCallRetry,
    }:{
        attemptNumber: number,
        onCallRetry: () => void
    }) {
        if (attemptNumber < 10) {
            setTimeout(() => onCallRetry(), 1000);
        }
    }
}

export class ReconnectCore {
    constructor(policy:ReconnectPolicy) {
        this.policy = policy;
    }

    private policy:ReconnectPolicy;

    onReTry({
        attemptNumber,
        onCallRetry,
    }:{
        attemptNumber: number,
        onCallRetry: () => void
    }) {
        this.policy.onReTry({
            attemptNumber,
            onCallRetry: () => {
                logger.debug(`reconnect attempt number: ${attemptNumber}`);
                onCallRetry();
            }
        });
    }
}