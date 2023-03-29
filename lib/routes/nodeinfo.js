import { loadConfiguration } from "../config.js";
import express from "express";

const config = loadConfiguration();

/**
 * @typedef {import("express").Request} Request
 * @typedef {import("express").Response} Response
 */

const router = express.Router();

router.get("/2.1", getNodeinfo);

/**
 *
 *
 * @author Drazi Crendraven
 * @param {Request} request
 * @param {Response} res
 */
function getNodeinfo(request, res) {
  const nodeInfo = JSON.stringify({
    version: "2.1",
    software: {
      name: "TootSweet",
      version: config.version,
      repository: "https://github.com/drazisil/toot-sweet",
      homepage: "https://github.com/drazisil/toot-sweet",
    },
    protocols: ["activitypub"],
    services: {
      inbound: [],
      outbound: [],
    },
    openRegistrations: false,
    usage: {
      users: {},
    },
    metadata: {},
  });

  res.setHeader("content-type", "application/json");

  res.json(nodeInfo);
  res.flushHeaders();
}

export { router as nodeinfoRouter };
