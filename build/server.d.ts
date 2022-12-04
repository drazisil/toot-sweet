#!/usr/bin/env node
import createLogger from "pino";
export declare const logger: createLogger.Logger<{
    level: string;
    streams: createLogger.MultiStreamRes;
} & createLogger.ChildLoggerOptions>;
