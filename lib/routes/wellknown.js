import {loadConfiguration} from "../config.js"
import express from "express"
import { WebFingerAccountManager } from "../webFinger.js";
import log from "../logger.js"
import { json404 } from "../json404.js";

const config = loadConfiguration()

/**
 * @typedef {import("express").Request} Request
 * @typedef {import("express").Response} Response
 */

const router = express.Router()

router.get("/webfinger", getWebFinger)

router.get("/nodeinfo", getNodeInfo)

/**
 *
 *
 * @author Drazi Crendraven
 * @param {Request} request
 * @param {Response} response
 */
function getWebFinger(request, response) {

    const requestedResource = request.query["resource"];

    // The host address this server recieved the request at
    const host = request.headers.host;

    if (typeof requestedResource === "undefined" || typeof host === "undefined") {
      log.error({ "reason": 'Requested resource was not able to be parsed' });
      return json404(response, "Requested resource was not able to be parsed");
    }

    const accountManager = WebFingerAccountManager.getAccountManager(config);

    /** @type {string} */
    let cleanedRequestedResource = String(requestedResource);

    const accountRecord = accountManager.find(cleanedRequestedResource);

    response.setHeader('content-type', 'application/json');

    if (typeof accountRecord === "undefined") {
      log.error({ "reason": "Record not found" });
      return json404(response, "Record not found");
    }
    return response.end(JSON.stringify(accountRecord));
}

/**
 *
 *
 * @author Drazi Crendraven
 * @param {Request} request
 * @param {Response} response
 */
function getNodeInfo(request, response) {
  response.setHeader('content-type', 'application/json');

  const nodeInfo = {
    "links": {
      "rel": "http://nodeinfo.diaspora.software/ns/schema/2.1",
      "href": `https://${config.siteHost}/nodeinfo/2.1`
    }
  }
  return response.end(JSON.stringify(nodeInfo))
}

export  {router as wellKnownRouter}
