#!/usr/bin/env node

import express from "express";
import bodyParser from "body-parser";
import createLogger, { destination, multistream } from "pino";
import pinoHTTP from "pino-http";
import { handle } from "./src/handlers.js";
import { ActorPerson } from "./src/APTypes.js";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const logger = createLogger({
    level: "trace",
    ...multistream([
        { stream: process.stdout },
        { stream: destination(`${__dirname}/combined.log`) },
    ]),
}).child({ service: "toot" });
logger.level = "trace";
const app = express();
const port = 9000;

function defaultRoute(req: express.Request, res: express.Response) {
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
    const systemActiors: ActorPerson[] = [
        new ActorPerson({
            id: "http://mc.drazisil.com:9000/@user1",
            subPublic: true,
        }),
    ];
}
