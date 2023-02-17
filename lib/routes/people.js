import express from "express"
import { Activity } from "../Activity.js";
import { Grouper } from "../Grouper.js";
import { json404 } from "../json404.js";
import { fetchRemoteActor, PeopleConnector } from "../PeopleConnector.js";
import { readFileSync } from "node:fs";
import log from "../logger.js";
import { sendActivity } from "../sendActivity.js";

/**
 * @typedef {import("express-serve-static-core").Request} Request
 * @typedef {import("express-serve-static-core").Response} Response
 * @typedef {import("../PeopleConnector.js").PersonRecord} PersonRecord
 */

const router = express.Router()

// Here at /people we can do a couple things
//
// * request a user as activitystreams
// * request a user as a human
// * post to an inbox
// * get a message

router.post("/:personId/:collectionName", postCollection)

router.get("/:personId/", async (request, response) => {
  const personId = request.params.personId
  const acceptType = request.headers.accept

  response.setHeader('content-type', 'text/html')

  if (acceptType?.includes("application/activity+json")) {
    response.setHeader('content-type', 'application/json')
  }

  const peopleConnector = PeopleConnector.getPeopleConnector()

  const person = peopleConnector.findPerson(personId)

  if (typeof person === "undefined") {
    return json404(response, "Person not found")
  }

  response.setHeader('content-type', 'application/json')

  return response.end(JSON.stringify(person))
})

/**
 *
 *
 * @author Drazi Crendraven
 * @param {Request} request
 * @param {Response} response
 */
async function postCollection(request, response) {

    const personId = request.params["personId"];
    const collectionName = request.params["collectionName"];
    const contentType = request.headers["content-type"];

    response.setHeader('content-type', 'text/html');

    if (contentType?.includes("application/activity+json")) {
      response.setHeader('content-type', 'application/json');
    } else {
      log.error({ reason: "Wrong content type" });
      return response.sendStatus(400);
    }

    const peopleConnector = PeopleConnector.getPeopleConnector();

    const person = peopleConnector.findPerson(personId);

    if (typeof person === "undefined") {
      return json404(response, "Person not found");
    }

    response.sendStatus(202);

    await handlePOSTToCollection(request, personId, collectionName, person);

    return response.end()
}

/**
 *
 * @param {Request} request
 * @param {string} personId
 * @param {string} collectionName
 * @param {PersonRecord} person
*/
async function handlePOSTToCollection(request, personId, collectionName, person) {

  const inboundActivity = await Activity.fromRequest(request);

  const grouper = Grouper.getGrouper();

  if (inboundActivity.type !== "Delete") {
    grouper.addToGroup(`${personId}.${collectionName}`, inboundActivity);

    log.info({ "requestedActorURI": inboundActivity.actor });


    const remoteActor = await fetchRemoteActor(inboundActivity.actor);

    const remoteActorInboxURL = new URL(remoteActor.inbox);

    grouper.addToGroup("remoteActors", remoteActor);

    log.info({ "remoteActorInboxHostname": remoteActorInboxURL.hostname });
    log.info({ "remoteActorInboxPath": remoteActorInboxURL.pathname });

    const respondingActivity = new Activity();
    respondingActivity.id = person.id.concat("/statuses/1/activity");
    respondingActivity.actor = person.id;
    respondingActivity.type = "Create";
    respondingActivity.object.id = person.id.concat("/statuses/1");
    respondingActivity.object.type = "Note";
    respondingActivity.object.inReplyTo = inboundActivity.id;
    respondingActivity.object.content = "Nope";
    respondingActivity.to = inboundActivity.actor;
    respondingActivity.headerHostname = remoteActorInboxURL.hostname;
    respondingActivity.headerMethod = "POST";
    respondingActivity.headerUrl = remoteActorInboxURL.pathname;

    const privateKey = readFileSync("data/global/production/account-identity.pem", "utf8");

    sendActivity(respondingActivity, privateKey, person, grouper);
  }
}

export default router
