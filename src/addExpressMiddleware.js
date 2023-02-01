import wellKnownRouter from "./routes/wellknown.js";
import peopleRouter from "./routes/people.js";
import logRouter from "./routes/log.js"
import groupsRouter from "./routes/groups.js"
import createExpress from "express";
import helmet from "helmet";
import log from "./logger.js"
import { Queue } from "./Queue.js";
import { Grouper } from "./Grouper.js";
import { Activity } from "./Activity.js";

/**
 * Add middlewhere to the Express app
 * @param {import("express").Express} app
 */

export function addExpressMiddleware(app) {

  const grouper = Grouper.getGrouper()

  grouper.createGroup("activityStreamsInbound")

  grouper.createGroup("actorsSeen")

  app.disable('x-powered-by')

  app.use(helmet())

  app.use(createExpress.json({ "type": "application/json" }))

  app.use(createExpress.json({ "type": "application/activity+json" }));

  app.use((request, response, next) => {
    if (request.headers["content-type"]?.includes("application/activity+json")) {
      const inboundActivity = Activity.fromRequest(request)

      if (inboundActivity.type !== "Delete") {
        grouper.addToGroup("activityStreamsInbound", inboundActivity)
      }
      grouper.addToGroup("actorsSeen", inboundActivity.actor)

    }
    next()
  })

  app.use("/log", logRouter);

  app.use("/groups", groupsRouter);

  app.use(requestLogger)

  app.use("/.well-known", wellKnownRouter);

  app.use("/people", peopleRouter);

  // This needs to redirect to /people
  app.use("/users", peopleRouter);

  app.use(createExpress.static("./public"));

  app.use((req, res, next) => {
    const logLine = { "error": "not found", "method": req.method, "url": req.url}
    // Queue.getQueue().add(logLine)
    log.info(logLine)
    next()
  })
}
/**
 *
 * @param {import("express-serve-static-core").Request} req
 * @param {import("express-serve-static-core").Response} res
 * @param {import("express-serve-static-core").NextFunction} next
 */
function requestLogger(req, res, next) {
    const logLine = { "headers": JSON.stringify(req.headers), "body": JSON.stringify(req.body), "method": req.method, "url": req.url, "remoteHost": req.socket.remoteAddress ?? "unknown" };
    Queue.getQueue().add({ "timestamp": (new Date()).toISOString(), ...logLine });
    next();
  }
