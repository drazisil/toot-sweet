import express from "express";
import { activityTypeIsValid, hasId } from "./index.js";
import { logger } from "../server.js";
import { handleFollowActivity } from "./activityHandlers/follow.js";

export interface ActivityPubJSON {
    "@context": string;
    type: string;
    id: string;
}

export class ActivityError extends Error {
    activity: Object;
    constructor(message: string, activity: Object) {
        super(message);
        this.activity = activity;
    }
}

const activityHandlers: Record<
    string,
    (activity: ActivityPubJSON, res: express.Response) => Promise<void>
> = {
    Follow: handleFollowActivity,
};

export function getActivityTargetType(inputJson: ActivityPubJSON) {
    const requestedObjectId = inputJson["object"];

    let activityTarget = "Unknown";

    if (requestedObjectId === "https://www.w3.org/ns/activitystreams#Public") {
        activityTarget = "Public";
    } else if (requestedObjectId.endsWith("/inbox")) {
        activityTarget = "Inbox";
    } else if (requestedObjectId.endsWith("/outbox")) {
        activityTarget = "Outbox";
    }

    logger.debug(`Requested object type: ${activityTarget}`);
    return activityTarget;
}

export async function handle(req: express.Request, res: express.Response) {
    const { body: activityJSON }: { body: ActivityPubJSON } = req;
    const jsonString = JSON.stringify(activityJSON);
    logger.debug(`${jsonString}`);

    if (
        req.accepts(
            'application/ld+json; profile="https://www.w3.org/ns/activitystreams'
        )
    ) {
        logger.debug("Has valid accept");
    } else {
        logger.debug(req.accepts);
        logger.debug("Does not have valid accept");
        res.status(406);
        res.end();
    }

    if (hasId(activityJSON)) {
        logger.debug("Has id");
    } else {
        logger.debug("Does not have valid id");
    }

    let activityType: string;
    try {
        activityType = activityJSON["type"] ?? "";
    } catch (error) {
        throw new Error(`Error parsing JSON: ${String(error)}`);
    }
    if (activityTypeIsValid(activityType)) {
        logger.debug(`Activity type [${activityType}]`);

        console.dir(activityJSON);

        await activityHandlers[activityType].call(this, activityJSON, res);
    } else {
        logger.debug(`Does not have valid activity type: ${activityType}`);
    }

    res.status(404);
    res.end();
}
