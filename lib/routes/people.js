import config from "../config.js"
import express from "express"
import { Activity } from "../Activity.js";
import { Grouper } from "../Grouper.js";
import { json404 } from "../json404.js";
import { fetchRemoteActor, PeopleConnector } from "../PeopleConnector.js";
import { readFileSync } from "node:fs";
import log from "../logger.js";
import { sendActivity } from "../sendActivity.js";
import { Collection } from "../Collection.js";
import { randomUUID } from "node:crypto";

const grouper = Grouper.getGrouper();

/**
 * @typedef {import("express-serve-static-core").Request} Request
 * @typedef {import("express-serve-static-core").Response} Response
 * @typedef {import("../PeopleConnector.js").PersonRecord} PersonRecord
 */

const router = express.Router()

// Here at /people we can do a couple things
//
// * post to an inbox
// * request a user as activitystreams
// * request a user as a human
// * get a message

router.get("/:personId/statuses/:statusId", getStatus)

router.get("/:personId/:collectionName", getCollection)

router.post("/:personId/:collectionName", postCollection)

router.get("/:personId/", getPerson)
/**
 *
 *
 * @author Drazi Crendraven
 * @param {Request} request
 * @param {Response} response
 */
async function getStatus(request, response) {
  const personId = request.params["personId"]

  const statuses = grouper.findGroup(personId.concat(".statuses"))
  const status = statuses.findId("https://".concat(config["SITE_HOST"], "/people", request.url))

  if (typeof status === "undefined") {
    return json404(response, "Status not found")
  }

  response.setHeader('content-type', 'application/json')

  return response.end(JSON.stringify(status))
}


/**
 *
 *
 * @author Drazi Crendraven
 * @param {Request} request
 * @param {Response} response
 */
async function getPerson(request, response) {
  const personId = request.params["personId"]
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
}

/**
 *
 *
 * @author Drazi Crendraven
 * @param {Request} request
 * @param {Response} response
 */
async function getCollection(request, response) {

  const personId = request.params["personId"];
  const collectionName = request.params["collectionName"];

  response.setHeader('content-type', 'application/json');

  const peopleConnector = PeopleConnector.getPeopleConnector();

  const person = peopleConnector.findPerson(personId);

  if (typeof person === "undefined") {
    return json404(response, "Person not found");
  }



  const group = grouper.findGroup(`${personId}.${collectionName}`);

  if (typeof group === "undefined") {
    return json404(response, "Collection not found");
  }

  const outboundCollection = new Collection()

  outboundCollection.id = `https://${config["SITE_HOST"]}/people/${personId}/${collectionName}`

  outboundCollection.items = [group]

  return response.end(outboundCollection.toStringWithContext())

}

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

  if (inboundActivity.type !== "Delete") {
    grouper.addToGroup(`${personId}.${collectionName}`, inboundActivity);

    log.info({ "requestedActorURI": inboundActivity.actor });


    const remoteActor = await fetchRemoteActor(inboundActivity.actor);

    const remoteActorInboxURL = new URL(remoteActor.inbox);

    grouper.addToGroup("remoteActors", remoteActor);

    log.info({ "remoteActorInboxHostname": remoteActorInboxURL.hostname });
    log.info({ "remoteActorInboxPath": remoteActorInboxURL.pathname });

    const respondingActivity = new Activity();
    const respondingActivityID = randomUUID()
    // Message
    respondingActivity.object.id = person.id.concat(`/statuses/${respondingActivityID}`);
    respondingActivity.object.to = inboundActivity.actor.concat("/followers")
    respondingActivity.object.cc = "https://www.w3.org/ns/activitystreams#Public"
    respondingActivity.object.type = "Note";
    respondingActivity.object.inReplyTo = inboundActivity.object.id;
    respondingActivity.object.content = `<p>Hi!</p>
    <p>This will probably look pretty bad. But I'm an auto-response to activity id: <a href="${inboundActivity.object.id}">${inboundActivity.object.id}</a></p>
    <p>This address is unmonitored...for now. :ablobcatwink:</p>`;
    // Activity
    respondingActivity.id = person.id.concat(`/statuses/${respondingActivityID}/activity`);
    respondingActivity.actor = person.id;
    respondingActivity.type = "Create";
    respondingActivity.to = inboundActivity.actor;
    // Activity Headers
    respondingActivity.headerHostname = remoteActorInboxURL.hostname;
    respondingActivity.headerMethod = "POST";
    respondingActivity.headerUrl = remoteActorInboxURL.pathname;

    const privateKey = readFileSync("data/global/production/account-identity.pem", "utf8");

    sendActivity(respondingActivity, privateKey, person, grouper);
  }
}

export default router
