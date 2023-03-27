import * as Sentry from "@sentry/node";
import { ProfilingIntegration } from "@sentry/profiling-node";
import * as Tracing from "@sentry/tracing";
import https from "@small-tech/https";
import createExpress from "express";
import helmet from "helmet";
import {
  bodyParser,
  errorHandler,
  ipCheckMiddleware,
  logActivities,
  logRequestMiddleware,
  notFoundHandler,
  requestLogger
} from "toot-sweet/middleware";
import { apiRouter, nodeinfoRouter, peopleRouter, wellKnownRouter } from "toot-sweet/routes";
import {loadConfiguration} from "./lib/config.js";
import { Grouper } from "./lib/Grouper.js";
import { Link } from "./lib/Link.js";
import log from "./lib/logger.js";
import { PeopleConnector } from "./lib/PeopleConnector.js";

const app = createExpress();

const config = loadConfiguration()

const options = {
  domains: [config.siteHost],
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
    new ProfilingIntegration(),
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

app.use(bodyParser);

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

  PeopleConnector.getPeopleConnector(config).addPerson("drazi");

  PeopleConnector.getPeopleConnector(config).addPerson("self");

  grouper.createGroup("activityStreamsInbound");

  grouper.createGroup("actorsSeen");

  grouper.createGroup("remoteActors");

  const server = https.createServer(options, app);

  grouper.createGroup("localHosts");

  config.localHosts.forEach((/** @type {string} */ entry) => {
    const host = new Link(entry, entry);
    host.id = entry;
    grouper.addToGroup("localHosts", host);
  });

  grouper.createGroup("blockedIPs");

  config.blockList.forEach((/** @type {string} */ entry) => {
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
  log.error({ reason: `Fatal error!: ${String(error) }` });
  process.exit(-1);
}
