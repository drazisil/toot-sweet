import https from "@small-tech/https";
import log from "./lib/logger.js";
import createExpress, * as express from "express";
import wellKnownRouter from "./lib/routes/wellknown.js";
import peopleRouter from "./lib/routes/people.js";
import apiRouter from "./lib/routes/api.js";
import adminRouter from "./lib/routes/admin.js";
import helmet from "helmet";
import { Queue } from "./lib/Queue.js";
import { Grouper } from "./lib/Grouper.js";
import { Activity } from "./lib/Activity.js";
import { logRequestMiddleware } from "./lib/logRequestMiddleware.js";

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

app.use(logRequestMiddleware());

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

app.use("/api", apiRouter);

app.use("/admin", adminRouter);

app.use(requestLogger);

app.use("/.well-known", wellKnownRouter);

app.use("/people", peopleRouter);

// This needs to redirect to /people
app.use("/users", peopleRouter);

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index", { foo: "FOO" });
});

//  statis files
app.use(createExpress.static("./public"));

// custom 404
app.use(notFoundHandler);

// custom error handler
app.use(errorHandler);

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
 * @param {import("express").NextFunction} _next
 */
// eslint-disable-next-line no-unused-vars
function notFoundHandler(req, res, _next) {
  const logLine = { error: "not found", method: req.method, url: req.url };
  log.info(logLine);
  res.status(404).send("Sorry can't find that!");
}

/**
 *
 * @param {Error} err
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} _next
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, _next) {
  const logLine = {
    error: "server error",
    method: req.method,
    url: req.url,
    stackTrace: err.stack,
  };
  log.error(logLine);
  res.status(500).send("Something broke!");
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
