import log from "../logger.js";
import * as Sentry from "@sentry/node";

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
// eslint-disable-next-line no-unused-vars
export function notFoundHandler(req, res, next) {
    const logLine = { error: "not found", method: req.method, url: req.url };
    Sentry.captureException(new Error(String(logLine)));
    log.info(logLine);
    res.status(404).send("Sorry can't find that!");
    next();
}
