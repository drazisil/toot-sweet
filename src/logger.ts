import { hostname } from "node:os";

export default function createLogger({
    defaultLevel = "info",
    serviceName,
}: {
    defaultLevel: "trace" | "debug" | "info" | "warn" | "error" | "fatal";
    serviceName: string;
}) {
    const envLevel = process.env["LOG_LEVEL"] ?? defaultLevel;

    const pid = process.pid;
    const systemHost = hostname;
    const levels = {
        trace: 10,
        debug: 20,
        info: 30,
        warn: 40,
        error: 50,
        fatal: 60,
    };
    const defaultLevelAsNumber = levels[envLevel];

    const _getLogLine = (
        requestedLevel: 10 | 20 | 30 | 40 | 50 | 60,
        message: string
    ) => {
        const timestamp = Date.now();
        if (requestedLevel >= defaultLevelAsNumber) {
            console.log(
                `{"level":${requestedLevel},"time":${timestamp},"pid":${pid},"hostname":"${systemHost}","service":"${serviceName}","msg":"${message}"}`
            );
        }
    };
    return {
        trace: (message: string) => _getLogLine(10, message),
        debug: (message: string) => _getLogLine(20, message),
        info: (message: string) => _getLogLine(30, message),
        warn: (message: string) => _getLogLine(40, message),
        error: (message: string) => _getLogLine(50, message),
        fatal: (message: string) => _getLogLine(60, message),
    };
}
