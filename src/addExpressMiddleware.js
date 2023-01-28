import wellKnownRouter from "./routes/wellknown.js";
import peopleRouter from "./routes/people.js";
import createExpress from "express";
import helmet from "helmet";
import log from "./log.js"

/**
 * Add middlewhere to the Express app
 * @param {import("express").Express} app
 */

export function addExpressMiddleware(app) {

  app.disable('x-powered-by')

  app.use(helmet())


  app.use(createExpress.json({ "type": "application/json" }))

  app.use(createExpress.json({ "type": "application/activity+json" }));

  app.use((req, res, next) => {
    log.info({ "headers": req.headers, "body": req.body, "method": req.method, "url": req.url})
    next()
  })

  app.use("/.well-known", wellKnownRouter);

  app.use("/people", peopleRouter);

  app.use(createExpress.static("./public"));
}
