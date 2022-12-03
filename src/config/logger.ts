import * as log from 'loglevel';

export enum LogLevel {
    trace = 0,
    debug = 1,
    info = 2,
    warn = 3,
    error = 4,
    silent = 5,
}

type LogLevelString = keyof typeof LogLevel;

type StructuredLogger = {
    trace: (msg: string, context?: object) => void;
    debug: (msg: string, context?: object) => void;
    info: (msg: string, context?: object) => void;
    warn: (msg: string, context?: object) => void;
    error: (msg: string, context?: object) => void;
};

const logger = log.getLogger('livelists');

logger.setLevel(LogLevel.info);

export default logger as StructuredLogger;

export function setLogLevel(level: LogLevel | LogLevelString) {
    logger.setLevel(level);
}

export type LogExtension = (level: LogLevel, msg: string, context?: object) => void;

/**
 * use this to hook into the logging function to allow sending internal livelists logs to third party services
 * if set, the browser logs will lose their stacktrace information (see https://github.com/pimterry/loglevel#writing-plugins)
 */
export function setLogExtension(extension: LogExtension) {
    const originalFactory = logger.methodFactory;

    logger.methodFactory = (methodName, logLevel, loggerName) => {
        const rawMethod = originalFactory(methodName, logLevel, loggerName);

        const configLevel = logger.getLevel();
        const needLog = logLevel >= configLevel && logLevel < LogLevel.silent;

        return (msg, context?: [msg: string, context: object]) => {
            if (context) rawMethod(msg, context);
            else rawMethod(msg);
            if (needLog) {
                extension(logLevel, msg, context);
            }
        };
    };
    logger.setLevel(logger.getLevel()); // Be sure to call setLevel method in order to apply plugin
}
