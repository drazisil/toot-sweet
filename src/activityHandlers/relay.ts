import { randomUUID } from "crypto";
import express from "express";
import prompts from 'prompts'
import { logger, serverBaseURI } from "../../server.js";
import { ActivityReject } from "../APTypes.js";
import { ActivityPubJSON } from "../handlers.js";

export async function relayFollowRequest(activity: ActivityPubJSON, res: express.Response) {
    logger.debug('Enter relay follow request handler')

    logger.debug(`Activity [${activity.id}] has requested to add us as a relay`);

    const response = await prompts({
        type: 'confirm',
        name: 'value',
        message: 'Should we accept this request?',
        initial: false
      });

      if (response.value) {
        logger.debug('We accepted the request')
      } else {
        logger.debug('We refused the request')
        const id = randomUUID()
        const rejectActivity = new ActivityReject({targetObject: activity.object, id, actor: `${serverBaseURI}/${id}`})
        res.json(rejectActivity.toJSON())
      }

    logger.debug('Exit relay follow request handler')
}
