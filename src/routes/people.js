import express from "express"
import { createPublicKey } from "node:crypto";
import { readFileSync } from "node:fs";
import { json404 } from "../json404.js";
import { PeopleConnector } from "../PeopleConnector.js";

const router = express.Router()

router.get("/:personId", (request, response) => {
  const personId = request.params.personId

  const peopleConnector = PeopleConnector.getPeopleConnector()

  const person = peopleConnector.findPerson(personId)

  const privateKey = readFileSync("data/global/production/account-identity.pem", "utf8")

  const publicKey = createPublicKey(privateKey).export({format: "pem", type: "pkcs1"})

  response.setHeader('content-type', 'application/json')

  if (typeof person === "undefined") {
return json404(response, "Person not found")
  }

  person.publicKey.publicKeyPem = publicKey.toString("utf8")

  return response.end(JSON.stringify(person))
})


export default router
