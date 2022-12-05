export default function createLogger({ defaultLevel, serviceName, }: {
    defaultLevel: "trace" | "debug" | "info" | "warn" | "error" | "fatal";
    serviceName: string;
}): {
    trace: (message: string) => void;
    debug: (message: string) => void;
    info: (message: string) => void;
    warn: (message: string) => void;
    error: (message: string) => void;
    fatal: (message: string) => void;
};
