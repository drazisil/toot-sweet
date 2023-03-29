import { Grouper } from "../Grouper.js";

const grouper = Grouper.getGrouper();

/**
 *
 *
 * @author Drazi Crendraven
 * @export
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 * @param {import("express").NextFunction} next
 */
export function ipCheckMiddleware(request, response, next) {
  const blockedIPsGroup = grouper.findGroup("blockedIPs");
  if (blockedIPsGroup.findId(request.socket.remoteAddress ?? "")) {
    request.socket.end();
    return;
  }
  next();
}
