import express from "express";
import { logger } from "../../server.js";
import { ActivityError, ActivityPubJSON, getActivityTargetType } from "../handlers.js";
import { relayFollowRequest } from "./relay.js";

export async function handleFollowActivity(
    activity: ActivityPubJSON,
    res: express.Response
) {
    logger.debug(`Enter Follow activity handler`);

    let activityTargetType;
    try {
        activityTargetType = getActivityTargetType(activity);
    } catch (error) {
        
    }
    logger.debug(`The activity target type is [${activityTargetType}]`);
    if (activityTargetType === "Public") {
        logger.debug("Calling relay follow request handler");
        await relayFollowRequest(activity, res);
    }

    logger.debug(`Exit Follow activity handler`);
}
