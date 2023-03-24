import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";
import https from "@small-tech/https";
import createExpress from "express";
import helmet from "helmet";
import config from "./lib/config.js";
import { getBody } from "./lib/getBody.js";
import { Grouper } from "./lib/Grouper.js";
import { Link } from "./lib/Link.js";
import log from "./lib/logger.js";
import { errorHandler } from "./lib/middleware/errorHandler.js";
import { ipCheckMiddleware } from "./lib/middleware/ipCheckMiddleware.js";
import { logActivities } from "./lib/middleware/logActivities.js";
import { logRequestMiddleware } from "./lib/middleware/logRequestMiddleware.js";
import { notFoundHandler } from "./lib/middleware/notFoundHandler.js";
import { requestLogger } from "./lib/middleware/requestLogger.js";
import apiRouter from "./lib/routes/api.js";
import nodeinfoRouter from "./lib/routes/nodeinfo.js";
import peopleRouter from "./lib/routes/people.js";
import wellKnownRouter from "./lib/routes/wellknown.js";
import {ProfilingIntegration} from "@sentry/profiling-node";

const app = createExpress();

const options = {
  domains: [config["SITE_HOST"]],
  settingsPath: "data",
};


Sentry.init({
  dsn: "https://92f8e46fa8fc4ceaa113b6c57a70eb99@o1413557.ingest.sentry.io/4504277664661504",
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0, // Profiling sample rate is relative to tracesSampleRate
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
    // Add profiling integration to list of integrations
    new ProfilingIntegration()
  ],
});

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

app.disable("x-powered-by");

app.use(ipCheckMiddleware);

app.use(helmet());

app.use(logRequestMiddleware);

app.use(getBody);

app.use(logActivities);

app.use("/api", apiRouter);

app.use(requestLogger);

app.use("/.well-known", wellKnownRouter);

app.use("/nodeinfo", nodeinfoRouter);

app.use("/people", peopleRouter);

// This needs to redirect to /people
app.use("/users", peopleRouter);

//  static files
app.use(createExpress.static("./build"));

// custom 404
app.use(notFoundHandler);

// custom error handler
app.use(errorHandler);

try {
  const grouper = Grouper.getGrouper();

  grouper.createGroup("activityStreamsInbound");

  grouper.createGroup("actorsSeen");

  grouper.createGroup("remoteActors");

  const server = https.createServer(options, app);

  grouper.createGroup("localHosts");

  config["LOCAL_HOSTS"].forEach((/** @type {string} */ entry) => {
    const host = new Link(entry, entry);
    host.id = entry;
    grouper.addToGroup("localHosts", host);
  });

  grouper.createGroup("blockedIPs");

  config["BLOCKLIST"].forEach((/** @type {string} */ entry) => {
    const host = new Link(entry, entry);
    host.id = entry;
    grouper.addToGroup("blockedIPs", host);
  });

  server.listen(443, () => {
    log.info(Object({ server: { status: "listening" } }));
  });

  server.on("error", (err) => {
    log.error(Object({ server: { status: "errored", reason: String(err) } }));
  });
} catch (error) {
  console.error(error);
  log.error({ reason: `Fatal error!: ${{ error: String(error) }}` });
  process.exit(-1);
}
