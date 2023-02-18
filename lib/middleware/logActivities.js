import { Activity } from "../Activity.js";
import { grouper } from "../../server.js";

/**
 *
 *
 * @author Drazi Crendraven
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 * @param {import("express").NextFunction} next
 */
export async function logActivities(request, response, next) {
    if (request.headers["content-type"]?.includes("application/activity+json")) {
        const inboundActivity = await Activity.fromRequest(request);

        if (inboundActivity.type !== "Delete") {
            grouper.addToGroup("activityStreamsInbound", inboundActivity);
        }
        grouper.addToGroup("actorsSeen", inboundActivity.actor);
    }
    next();
}
