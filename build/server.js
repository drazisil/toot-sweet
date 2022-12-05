#!/usr/bin/env node
import express from "express";
import bodyParser from "body-parser";
import { handle } from "./src/handlers.js";
import { ActorPerson } from "./src/APTypes.js";
import createLogger from "./src/logger.js";
export const logger = createLogger({ defaultLevel: "trace", serviceName: "toot" });
const app = express();
const port = 9000;
export const serverBaseURI = `http://mc.drazisil.com:${port}`;
function defaultRoute(req, res) {
    logger.info(`${req.method} - ${req.url}`);
    handle(req, res);
}
app.use(bodyParser.json({ type: "application/activity+json" }));
app.use(defaultRoute);
const server = app.listen(port, () => {
    logger.info("Hello");
    logger.info(`Example app listening on port ${port}`);
});
await init();
process.on("SIGINT", () => {
    logger.info("SIGINT signal received: closing HTTP server");
    server.close(() => {
        logger.info("HTTP server closed");
    });
});
async function init() {
    const systemActiors = [
        new ActorPerson({
            id: "http://mc.drazisil.com:9000/@user1",
            subPublic: true,
        }),
    ];
}
//# sourceMappingURL=server.js.map