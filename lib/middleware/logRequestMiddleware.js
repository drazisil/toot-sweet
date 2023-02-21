import { Grouper } from "../Grouper.js";

const grouper = Grouper.getGrouper();

/**
 * @typedef {import("express").Request} Request
 * @typedef {import("express").Response} Response
 * @typedef {import("express").NextFunction} NextFunction
 */

/**
 * Middleware to request method and url
 *
 * @author Drazi Crendraven
 * @export
 * @param {Request} request
 * @param {Response} response
 * @param {NextFunction} next
 */
export function logRequestMiddleware(request, response, next) {
  const localHosts = grouper.findGroup("localHosts") ?? [];

  if (localHosts.findId(request.socket.remoteAddress ?? "")) {
    return next();
  }
  const { method, hostname, path, headers } = request;
  console.log(
    request.socket.remoteAddress,
    method,
    hostname,
    path,
    headers["accept"],
    headers["content-type"]
  );
  next();
}
