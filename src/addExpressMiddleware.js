import wellKnownRouter from "./routes/wellknown.js";
import peopleRouter from "./routes/people.js";
import createExpress from "express";
import pinoHttp from "pino-http"
import helmet from "helmet";

/**
 * Add middlewhere to the Express app
 * @param {import("express").Express} app
 */

export function addExpressMiddleware(app) {

  app.disable('x-powered-by')

  app.use(helmet())

  app.use(pinoHttp())

  app.use(createExpress.json({ "type": "application/activity+json" }));

  app.use("/.well-known", wellKnownRouter);

  app.use("/people", peopleRouter);

  app.use(createExpress.static("./public"));
}
