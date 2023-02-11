import https from "@small-tech/https";
import log from "./lib/logger.js";
import createExpress, * as express from "express";
import wellKnownRouter from "./lib/routes/wellknown.js";
import peopleRouter from "./lib/routes/people.js";
import logRouter from "./lib/routes/log.js";
import groupsRouter from "./lib/routes/groups.js";
import helmet from "helmet";
import { Queue } from "./lib/Queue.js";
import { Grouper } from "./lib/Grouper.js";
import { Activity } from "./lib/Activity.js";

const app = createExpress();

export const ROOT_DOMAIN = "mc.drazisil.com";

const options = {
  domains: [ROOT_DOMAIN],
  settingsPath: "data",
};

const grouper = Grouper.getGrouper();

grouper.createGroup("activityStreamsInbound");

grouper.createGroup("actorsSeen");

grouper.createGroup("remoteActors");

app.disable("x-powered-by");

app.use(helmet());

app.use(express.json({ type: "application/json" }));

app.use(express.json({ type: "application/activity+json" }));

app.use((request, response, next) => {
  if (request.headers["content-type"]?.includes("application/activity+json")) {
    const inboundActivity = Activity.fromRequest(request);

    if (inboundActivity.type !== "Delete") {
      grouper.addToGroup("activityStreamsInbound", inboundActivity);
    }
    grouper.addToGroup("actorsSeen", inboundActivity.actor);
  }
  next();
});

app.use("/log", logRouter);

app.use("/groups", groupsRouter);

app.use(requestLogger);

app.use("/.well-known", wellKnownRouter);

app.use("/people", peopleRouter);

// This needs to redirect to /people
app.use("/users", peopleRouter);

app.use(createExpress.static("./public"));

app.use((req, res, next) => {
  const logLine = { error: "not found", method: req.method, url: req.url };
  // Queue.getQueue().add(logLine)
  log.info(logLine);
  next();
});

try {
  const server = https.createServer(options, app);

  server.listen(443, () => {
    log.info(Object({ server: { status: "listening" } }));
  });

  server.on("error", (/** @type {unknown} */ err) => {
    log.error(Object({ server: { status: "errored", reason: String(err) } }));
  });
} catch (error) {
  log.error({ reason: `Fatal error!: ${{ error }}` });
  process.exit(-1);
}

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
function requestLogger(req, res, next) {
  const logLine = {
    headers: JSON.stringify(req.headers),
    body: JSON.stringify(req.body),
    method: req.method,
    url: req.url,
    remoteHost: req.socket.remoteAddress ?? "unknown",
  };
  Queue.getQueue().add({ timestamp: new Date().toISOString(), ...logLine });
  next();
}
