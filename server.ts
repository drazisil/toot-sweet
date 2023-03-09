import config from "./lib/config.js";
import https from "@small-tech/https";
import log from "./lib/logger.js";
import createExpress from "express";
import wellKnownRouter from "./lib/routes/wellknown.js";
import peopleRouter from "./lib/routes/people.js";
import apiRouter from "./lib/routes/api.js";
import adminRouter from "./lib/routes/admin.js";
import nodeinfoRouter from "./lib/routes/nodeinfo.js";
import helmet from "helmet";
import { Grouper } from "./lib/Grouper.js";
import { logRequestMiddleware } from "./lib/middleware/logRequestMiddleware.js";
import { logActivities } from "./lib/middleware/logActivities.js";
import { notFoundHandler } from "./lib/middleware/notFoundHandler.js";
import { errorHandler } from "./lib/middleware/errorHandler.js";
import { requestLogger } from "./lib/middleware/requestLogger.js";
import { getBody } from "./lib/getBody.js";
import { ipCheckMiddleware } from "./lib/middleware/ipCheckMiddleware.js";
import { Link } from "./lib/Link.js";

const app = createExpress();

const options = {
  domains: [config["SITE_HOST"]],
  settingsPath: "data",
};

app.disable("x-powered-by");

app.use(ipCheckMiddleware);

app.use(helmet());

app.use(logRequestMiddleware);

app.use(getBody);

app.use(logActivities);

app.use("/api", apiRouter);

app.use("/admin", adminRouter);

app.use(requestLogger);

app.use("/.well-known", wellKnownRouter);

app.use("/nodeinfo", nodeinfoRouter);

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
  const grouper = Grouper.getGrouper();

  grouper.createGroup("activityStreamsInbound");

  grouper.createGroup("actorsSeen");

  grouper.createGroup("remoteActors");

  const server = https.createServer(options, app);

  grouper.createGroup("localHosts");

  config["LOCAL_HOSTS"].forEach((entry: string) => {
    const host = new Link(entry, entry)
    host.id = entry
    grouper.addToGroup("localHosts", host);
  });

  grouper.createGroup("blockedIPs");

  config["BLOCKLIST"].forEach((entry: string) => {
    const host = new Link(entry, entry)
    host.id = entry
    grouper.addToGroup("blockedIPs", host);
  });

  server.listen(443, () => {
    log.info(Object({ server: { status: "listening" } }));
  });

  server.on("error", (err: unknown) => {
    log.error(Object({ server: { status: "errored", reason: String(err) } }));
  });
} catch (error) {
  console.error(error);
  log.error({ reason: `Fatal error!: ${{ error: String(error) }}` });
  process.exit(-1);
}
