import wellKnownRouter from "./routes/wellknown.js";
import peopleRouter from "./routes/people.js";
import logRouter from "./routes/log.js"
import createExpress from "express";
import helmet from "helmet";
import log from "./logger.js"
import { Queue } from "./Queue.js";

/**
 * Add middlewhere to the Express app
 * @param {import("express").Express} app
 */

export function addExpressMiddleware(app) {

  app.disable('x-powered-by')

  app.use(helmet())


  app.use(createExpress.json({ "type": "application/json" }))

  app.use(createExpress.json({ "type": "application/activity+json" }));

  app.use("/log", logRouter);

  app.use((req, res, next) => {
    const logLine = { "headers": JSON.stringify(req.headers), "body": JSON.stringify(req.body), "method": req.method, "url": req.url, "remoteHost": req.socket.remoteAddress ?? "unknown"}
    Queue.getQueue().add(logLine)
    log.info(logLine)
    next()
  })

  app.use("/.well-known", wellKnownRouter);

  app.use("/people", peopleRouter);


  app.use(createExpress.static("./public"));

  app.use((req, res, next) => {
    const logLine = { "error": "not found", "method": req.method, "url": req.url}
    Queue.getQueue().add(logLine)
    log.info(logLine)
    next()
  })
}
