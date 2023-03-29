import {loadConfiguration} from "../config.js"
import express from "express"
import { Activity } from "toot-sweet/models";
import { Grouper } from "../Grouper.js";
import { json404 } from "../json404.js";
import { fetchRemoteActor, PeopleConnector } from "../PeopleConnector.js";
import { readFileSync } from "node:fs";
import log from "../logger.js";
import { sendActivity } from "../sendActivity.js";
import { Collection } from "../Collection.js";
import { createRespondingActivity } from "../createRespondingActivity.js";

const grouper = Grouper.getGrouper();

const config = loadConfiguration()

/**
 * @typedef {import("express").Request} Request
 * @typedef {import("express").Response} Response
 * @typedef {import("../models/Person.js").PersonRecord} PersonRecord
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
 * @param {Response} res
 */
export async function getStatus(request, res) {
  const personId = request.params["personId"]

  const statuses = grouper.findGroup(personId.concat(".statuses"))
  const status = statuses.findId("https://".concat(config.siteHost, "/people", request.url))

  if (typeof status === "undefined") {
    return json404(res, "Status not found")
  }

  res.setHeader('content-type', 'application/json')

  res.json(status)
  res.flushHeaders()
}


/**
 *
 *
 * @author Drazi Crendraven
 * @param {Request} request
 * @param {Response} res
 */
export async function getPerson(request, res) {
  const personId = request.params["personId"]
  const acceptType = request.headers.accept

  res.setHeader('content-type', 'text/html')

  if (acceptType?.includes("application/activity+json")) {
    res.setHeader('content-type', 'application/json')
  }

  const peopleConnector = PeopleConnector.getPeopleConnector(config)

  const person = peopleConnector.findPerson(personId)

  if (typeof person === "undefined") {
    return json404(res, "Person not found")
  }

  res.setHeader('content-type', 'application/json')

  res.json(person)
  res.flushHeaders()
}

/**
 *
 *
 * @author Drazi Crendraven
 * @param {Request} request
 * @param {Response} res
 */
export async function getCollection(request, res) {

  const personId = request.params["personId"];
  const collectionName = request.params["collectionName"];

  res.setHeader('content-type', 'application/json');

  const peopleConnector = PeopleConnector.getPeopleConnector(config);

  const person = peopleConnector.findPerson(personId);

  if (typeof person === "undefined") {
    return json404(res, "Person not found");
  }



  const group = grouper.findGroup(`${personId}.${collectionName}`);

  if (typeof group === "undefined") {
    return json404(res, "Collection not found");
  }

  const outboundCollection = new Collection()

  outboundCollection.id = `https://${config.siteHost}/people/${personId}/${collectionName}`

  outboundCollection.items = [group]

  res.json(outboundCollection.toStringWithContext())
  res.flushHeaders()

}

/**
 *
 *
 * @author Drazi Crendraven
 * @param {Request} request
 * @param {Response} res
 */
export async function postCollection(request, res) {

  const personId = request.params["personId"];
  const collectionName = request.params["collectionName"];
  const contentType = request.headers["content-type"];

  res.setHeader('content-type', 'text/html');

  if (contentType?.includes("application/activity+json")) {
    res.setHeader('content-type', 'application/json');
  } else {
    log.error({ reason: "Wrong content type" });
    return res.sendStatus(400);
  }

  const peopleConnector = PeopleConnector.getPeopleConnector(config);

  const person = peopleConnector.findPerson(personId);

  if (typeof person === "undefined") {
    return json404(res, "Person not found");
  }

  await handlePOSTToCollection(request, personId, collectionName, person);
  
  res.status(202).end();
}

/**
 *
 * @param {Request} request
 * @param {string} personId
 * @param {string} collectionName
 * @param {PersonRecord} person
*/
export async function handlePOSTToCollection(request, personId, collectionName, person) {

  const inboundActivity = await Activity.fromRequest(request);

  if (inboundActivity.type !== "Delete") {
    grouper.addToGroup(`${personId}.${collectionName}`, inboundActivity);

    log.info({ "requestedActorURI": inboundActivity.actor });


    const remoteActor = await fetchRemoteActor(inboundActivity.actor);

    const remoteActorInboxURL = new URL(remoteActor.inbox);

    grouper.addToGroup("remoteActors", remoteActor);

    const respondingActivity = createRespondingActivity(remoteActorInboxURL, person, inboundActivity);

    const privateKey = readFileSync("data/global/production/account-identity.pem", "utf8");

    sendActivity(respondingActivity, privateKey, person, grouper);
  }
}

export  {router as peopleRouter}
