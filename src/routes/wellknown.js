import express from "express"
import { WebFingerAccountManager } from "../webFinger.js";
import log from "../logger.js"
import { json404 } from "../json404.js";

const router = express.Router()

router.get("/webfinger", (request, response) => {
  const requestedResource = request.query["resource"];

  // The host address this server recieved the request at
  const host = request.headers.host;

  if (typeof requestedResource === "undefined" || typeof host === "undefined") {
      log.error({"reason": 'Requested resource was not able to be parsed'});
      return json404(response, "Requested resource was not able to be parsed");
    }

    const accountManager = WebFingerAccountManager.getAccountManager()

      /** @type {string} */
    let cleanedRequestedResource = String(requestedResource)

    const accountRecord = accountManager.find(cleanedRequestedResource)

    response.setHeader('content-type', 'application/json')

    if (typeof accountRecord === "undefined") {
      log.error({"reason": "Record not found"});
      return json404(response, "Record not found");
    }
    return response.end(JSON.stringify(accountRecord))
})

export default router
