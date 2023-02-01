import express from "express"
import { Activity } from "../Activity.js";
import { Grouper } from "../Grouper.js";
import { json404 } from "../json404.js";
import { PeopleConnector } from "../PeopleConnector.js";

const router = express.Router()

// Here at /people we can do a couple things
//
// * request a user as activitystreams
// * request a user as a human
// * post to an inbox
// * get a message

router.all("/:personId/:collectionName?", (request, response) => {
  const requestMethod = request.method
  const personId = request.params.personId
  const collectionName = request.params.collectionName
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

  if (collectionName && requestMethod === "POST") {
    // Look for, or create a collection.
    const inboundActivity = Activity.fromRequest(request)

    const grouper = Grouper.getGrouper()

    grouper.addToGroup(`${personId}.${collectionName}`, inboundActivity)
  }

  // Otherwise...
  response.setHeader('content-type', 'application/json')

  return response.end(JSON.stringify(person))
})


export default router
