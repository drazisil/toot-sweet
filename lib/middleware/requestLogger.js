import { Queue } from "../Queue.js";

/**
 * @typedef {import("express").Request} Request
 * @typedef {import("express").Response} Response
 * @typedef {import("express").NextFunction} NextFunction
 */

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
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
