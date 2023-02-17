import https from "@small-tech/https";
import log from "./lib/logger.js";
import createExpress from "express";
import wellKnownRouter from "./lib/routes/wellknown.js";
import peopleRouter from "./lib/routes/people.js";
import apiRouter from "./lib/routes/api.js";
import adminRouter from "./lib/routes/admin.js";
import helmet from "helmet";
import { Queue } from "./lib/Queue.js";
import { Grouper } from "./lib/Grouper.js";
import { Activity } from "./lib/Activity.js";
import { logRequestMiddleware } from "./lib/logRequestMiddleware.js";
import { connectDB } from "./lib/db.js";
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";
import { ProfilingIntegration } from "@sentry/profiling-node";

const app = createExpress();

/**
 * @typedef {import("express-serve-static-core").Request} Request
 * @typedef {import("express-serve-static-core").Response} Response
 * @typedef {import("express-serve-static-core").NextFunction} NextFunction
 */


Sentry.init({
  dsn: "https://92f8e46fa8fc4ceaa113b6c57a70eb99@o1413557.ingest.sentry.io/4504277664661504",
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
    // Add profiling integration to list of integrations
    new ProfilingIntegration()
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0 // Profiling sample rate is relative to tracesSampleRate
});

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


// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

app.use(logRequestMiddleware);

app.use(getBody)

app.use(logActivities);

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

try {
  app.use(
    Sentry.Handlers.errorHandler({
      shouldHandleError(error) {

        const logLine = {
          error: "(Sentry) server error",
          errCode: error.status,
          stackTrace: error.stack,
        };
        log.error(logLine);

        // Capture all 404 and 500 errors
        if (error.status === 404 || error.status === 500) {
          return true;
        }
        return false;
      },
    })
  );

  // custom error handler
  app.use(errorHandler);

  const server = https.createServer(options, app);

  await connectDB()

  server.listen(443, () => {
    log.info(Object({ server: { status: "listening" } }));
  });

  server.on("error", (/** @type {unknown} */ err) => {
    log.error(Object({ server: { status: "errored", reason: String(err) } }));
  });
} catch (error) {
  console.error(error);
  log.error({ reason: `Fatal error!: ${{ "error": String(error) }}` });
  process.exit(-1);
}

/**
 *
 *
 * @author Drazi Crendraven
 * @param {Request} request
 * @param {Response} response
 * @param {NextFunction} next
 */
async function logActivities (request, response, next) {
  if (request.headers["content-type"]?.includes("application/activity+json")) {
    const inboundActivity = await Activity.fromRequest(request);

    if (inboundActivity.type !== "Delete") {
      grouper.addToGroup("activityStreamsInbound", inboundActivity);
    }
    grouper.addToGroup("actorsSeen", inboundActivity.actor);
  }
  next();
}

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
// eslint-disable-next-line no-unused-vars
function notFoundHandler(req, res, next) {
  const logLine = { error: "not found", method: req.method, url: req.url };
  log.info(logLine);
  res.status(404).send("Sorry can't find that!");
  next()
}

/**
 *
 * @param {Error} err
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const logLine = {
    error: "server error",
    method: req.method,
    url: req.url,
    stackTrace: err.stack,
  };
  log.error(logLine);
  res.status(500).send("Something broke!");
  next(err)
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

/**
 *
 *
 * @author Drazi Crendraven
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 * @param {import("express").NextFunction} next

 */
async function getBody(request, response, next) {
  /** @type {string[]} */
  let bodyChunks = [];

  let body = ""

  const bodyPromise = new Promise((resolve, reject) => {
    request.on('data', (chunk) => {
      bodyChunks.push(chunk);
    })
    request.on('end', () => {
      body = bodyChunks.toString()
      resolve(body)
    });
    request.on("error", (err) => { reject(err) })
  })
  request.body = bodyPromise
  next()
}
