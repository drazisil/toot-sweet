import { Queue } from "../Queue.js";

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export function requestLogger(req, res, next) {
    const logLine = {
        headers: JSON.stringify(req.headers),
        body: JSON.stringify(req.body),
        method: req.method,
        url: req.url,
        remoteHost: req.socket.remoteAddress ?? "unknown",
    };
    Queue.getQueue().add({ timestamp: new Date().toISOString(), ...logLine });
    next();
}
