import log from "../logger.js";

/**
 *
 * @param {Error} err
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
    const logLine = {
        error: "server error",
        method: req.method,
        url: req.url,
        stackTrace: err.stack,
    };
    log.error(logLine);
    res.status(500).send("Something broke!");
    next(err);
}
