import express from 'express'
import createDebug from 'debug'
import { createLogger } from 'bunyan'
import httpSignature from 'http-signature'
import { readFileSync } from 'node:fs'
// == Config
const appName = 'toot-sweet'
const port = 9000
// === Init
const debug = createDebug('toot-sweet')
const log = createLogger({name: appName})
const app = express()

// === Middleware
app.use(express.json({type: 'application/activity+json'}))

// === Route
app.get('/', (req, res) => {
  debug(`Hello from ${appName}`)
  res.send('Hello World!')
})

app.post('/inbox', (req, res) => {
  if (req.headers['content-type'] === 'application/activity+json') {
    debug(`${req.method} ${req.path}`)
    /** @type {{keyId: string}} */
    const parsed = httpSignature.parseRequest(req, {});
    const pub = readFileSync(new URL(parsed.keyId), 'ascii');
    debug(httpSignature.verifySignature(parsed, pub))
    debug(req.headers)
    debug(req.body)
  }
})

// === Serve
app.listen(port, () => {
  log.info(`${appName} app listening on port ${port}`)
})