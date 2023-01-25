import express from "express"
import createLogger from "pino"
import { json404 } from "../json404.js";
import { PeopleConnector } from "../PeopleConnector.js";

const log = createLogger()

const router = express.Router()

router.get("/:personId", (request, response) => {
  const personId = request.params.personId

  const peopleConnector = PeopleConnector.getPeopleConnector()

  const person = peopleConnector.findPerson(personId)

  response.setHeader('content-type', 'application/json')

  if (typeof person === "undefined") {
return json404(response, "Person not found")
  }

  return response.end(JSON.stringify(person))
})


export default router
