import https from '@small-tech/https'
import log from './lib/logger.js'
import createExpress, * as express from "express"
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

const app = createExpress()

export const ROOT_DOMAIN = "mc.drazisil.com"

const options = {
  domains: [ROOT_DOMAIN],
  settingsPath: "data"
}

const grouper = Grouper.getGrouper()

grouper.createGroup("activityStreamsInbound")

grouper.createGroup("actorsSeen")

grouper.createGroup("remoteActors")

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
  const logLine = { "error": "not found", "method": req.method, "url": req.url }
  // Queue.getQueue().add(logLine)
  log.info(logLine)
  next()
})

try {

  const server = https.createServer(options, app)

  server.listen(443, () => {
    log.info(Object({ "server": { "status": "listening" } }))
  })

  server.on("error", (/** @type {unknown} */ err) => {
    log.error(Object({ "server": { "status": "errored", "reason": String(err) } }))
  })
} catch (error) {
  log.error({ "reason": `Fatal error!: ${{ error }}` })
  process.exit(-1)
}


