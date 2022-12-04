import express from "express";
import { activityTypeIsValid, hasId } from "./src/index.js";
import { debug } from "./server.js";

export interface ActivityPubJSON {
    '@context'?: string
    type?: string
    id?: string
}

function handleFollowActivity(inputJson: ActivityPubJSON, res: express.Response) {
    debug(`Enter Follow activity handler`)

    getObjectType(inputJson);

    debug(`Exit Follow activity handler`)
}

const activityHandlers = {
    'Follow': handleFollowActivity
}

function getObjectType(inputJson: ActivityPubJSON) {
    const requestedObjectId = inputJson['object'];

    let requestedObjectType = 'Unknown';

    if (requestedObjectId === 'https://www.w3.org/ns/activitystreams#Public') {
        requestedObjectType = 'Public';
    } else if (requestedObjectId.endsWith('/inbox')) {
        requestedObjectType = 'Inbox';
    } else if (requestedObjectId.endsWith('/outbox')) {
        requestedObjectType = 'Outbox';
    }

    debug(`Requested object type: ${requestedObjectType}`);
    return requestedObjectType
}

export function handle(req: express.Request, res: express.Response) {
    try {
        const { body: json }: {body: ActivityPubJSON} = req;
        const jsonString = JSON.stringify(json);
        debug(`${jsonString}`);

        if (req.accepts(
            'application/ld+json; profile="https://www.w3.org/ns/activitystreams'
        )) {
            debug("Has valid accept");
        } else {
            debug(req.accepts);
            debug("Does not have valid accept");
            res.status(406);
            res.end();
        }

        if (hasId(json)) {
            debug("Has id");
        } else {
            debug("Does not have valid id");
        }

        const activityType = json['type'] ?? '';

        if (activityTypeIsValid(activityType)) {
            debug(`Activity type [${activityType}]`);

            console.dir(json)

            activityHandlers[activityType].call(json, res)
        } else {
            debug(`Does not have valid activity type: ${activityType}`);
        }


    } catch (error) {
        throw new Error(`Error parsing JSON: ${String(error)}`);
    } finally {
        res.status(404);
        res.end();
    }
}
