#!/usr/bin/env node
import createLogger from "pino";
export declare const logger: createLogger.Logger<{
    write: (data: any) => void;
    add: (dest: createLogger.DestinationStream | createLogger.StreamEntry) => createLogger.MultiStreamRes;
    flushSync: () => void;
    minLevel: number;
    streams: createLogger.StreamEntry[];
    clone(level: createLogger.Level): createLogger.MultiStreamRes;
    level: string;
} & createLogger.ChildLoggerOptions>;
