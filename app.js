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
const log = createLogger({ name: appName })
const app = express()

// === Methods
/**
 * 
 * @param {string} keyId 
 * @returns {Promise<string>}
 */
async function fetchActorPublicKey(keyId) {
  const url = new URL(keyId)
  return fetch(new URL(keyId))
    .then(res => {
      return res.json()
    }).then(json => {
      return json.publicKey.publicKeyPem
    })
    .catch(err => {
      log.error(err)
      throw new Error(`Unable to fetch actor key`)
    })
}

// === Middleware
app.use(express.json({ type: 'application/activity+json' }))

// === Route
app.get('/', (req, res) => {
  debug(`Hello from ${appName}`)
  res.send('Hello World!')
})

app.post('/inbox', validateRequest)

// === Serve
app.listen(port, () => {
  log.info(`${appName} app listening on port ${port}`)
})

/**
 * 
 * @param {express.Request} req 
 */
async function validateRequest(req) {
  if (req.headers['content-type'] === 'application/activity+json') {
    debug(`${req.method} ${req.path}`)
    /** @type {{keyId: string}} */
    const parsed = httpSignature.parseRequest(req, {})


    debug(parsed.keyId)
    const key = await fetchActorPublicKey(parsed.keyId)
    const validHTTPSignature = httpSignature.verifySignature(parsed, key)
    debug(`Signature is valid: ${validHTTPSignature}`)

    debug(req.body)
  }
}
