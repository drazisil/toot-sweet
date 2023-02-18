import { Activity } from "../Activity.js";
import { Grouper } from "../Grouper.js";

/**
 * @typedef {import("express").Request} Request
 * @typedef {import("express").Response} Response
 * @typedef {import("express").NextFunction} NextFunction
 */

/**
 *
 *
 * @author Drazi Crendraven
 * @param {Request} request
 * @param {Response} response
 * @param {NextFunction} next
 */
export async function logActivities(request, response, next) {
    if (request.headers["content-type"]?.includes("application/activity+json")) {
      request.body = JSON.parse(await request.body)
      const inboundActivity = await Activity.fromRequest(request);

        const grouper = Grouper.getGrouper()

        if (inboundActivity.type !== "Delete") {
            grouper.addToGroup("activityStreamsInbound", inboundActivity);
        }
        grouper.addToGroup("actorsSeen", inboundActivity.actor);
    }
    next();
}
