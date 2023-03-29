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
    sentryId: res.get("sentry"),
  };
  log.error(logLine);
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.send(res.get("sentry") + "\n");
  res.flushHeaders();
}
