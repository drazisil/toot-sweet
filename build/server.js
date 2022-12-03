#!/usr/bin/env node
import express from 'express';
import bodyParser from 'body-parser';
import createDebug from 'debug';
const debug = createDebug('toot');
const app = express();
const port = 9000;
function defaultRoute(req, res) {
    debug(`${req.method} - ${req.url}`);
    debug(`${req.body}`);
    console.dir(req.body);
    res.status(404);
    res.end();
}
app.use(bodyParser.json({ type: 'application/activity+json' }));
app.get('/', (req, res) => {
    res.end('Hello World!');
});
app.use(defaultRoute);
const server = app.listen(port, () => {
    debug('Hello');
    debug(`Example app listening on port ${port}`);
});
process.on('SIGINT', () => {
    debug('SIGINT signal received: closing HTTP server');
    server.close(() => {
        debug('HTTP server closed');
    });
});
