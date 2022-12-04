import express from "express";
import { logger } from "../../server.js";
import { ActivityError, ActivityPubJSON, getActivityTargetType } from "../handlers.js";
import { relayFollowRequest } from "./relay.js";

export async function handleFollowActivity(
    activity: ActivityPubJSON,
    res: express.Response
) {
    logger.debug(`Enter Follow activity handler`);

    try {
        const activityTargetType = getActivityTargetType(activity);
        logger.debug(`The activity target type is [${activityTargetType}]`);
        if (activityTargetType === "Public") {
            logger.debug("Calling relay follow request handler");
            await relayFollowRequest(activity, res);
        }
    } catch (error) {
        throw new ActivityError("Error getting activity type", activity);
    }
    logger.debug(`Exit Follow activity handler`);
}
