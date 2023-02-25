import log from "../logger.js";

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
// eslint-disable-next-line no-unused-vars
export function notFoundHandler(req, res, next) {
    const logLine = { error: "not found", method: req.method, url: req.url };
    log.info(logLine);
    res.status(404).send("Sorry can't find that!");
    next();
}
