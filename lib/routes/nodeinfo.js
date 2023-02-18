import config from "../config.js"
import express from "express"

/**
 * @typedef {import("express").Request} Request
 * @typedef {import("express").Response} Response
 */

const nodeInfo = JSON.stringify({
  "version": "2.1",
  "software": {
    "name": "TootSweet",
    "version": config["VERSION"],
    "repository": "https://github.com/drazisil/toot-sweet",
    "homepage": "https://github.com/drazisil/toot-sweet"
  },
  "protocols": ["activitypub"],
  "services": {
    "inbound": [],
    "outbound": []
  },
  "openRegistrations": false,
  "usage": {
    "users": {}
  },
  "metadata": {}
})

const router = express.Router()

router.get("/2.1", getNodeinfo)


/**
 *
 *
 * @author Drazi Crendraven
 * @param {Request} request
 * @param {Response} response
 */
function getNodeinfo(request, response) {
  response.setHeader('content-type', 'application/json');

  return response.end(nodeInfo)
}

export default router
