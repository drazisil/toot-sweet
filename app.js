import express from 'express'
import createDebug from 'debug'
import { createLogger } from 'bunyan'
import httpSignature from 'http-signature'
import { apiRouter } from './src/routers/index.js'
import { ObjectManager } from './src/ObjectManager.js'
import { Collection } from './src/Collection.js'
import { readFileSync } from 'fs'
import { Actor } from './src/Actor.js'
import { ActivityPubObject } from './src/ActivityPubObject.js'
import { Application } from './src/Application.js'


//#region Config
const appName = 'toot-sweet'
const port = 9000
//#endregion Config

//#region Init
const debug = createDebug('toot-sweet')
const log = createLogger({ name: appName })
const app = express()
//#endregion Init
//#region Types
/**
 * @typedef {Object} ParsedHTTPSignature
 * @property {string} keyId
*/
//#endregion Types



//#region Methods
/**
 * Fetch an Actor object
 * @param {string} id 
 * @returns {Promise<Application>}
*/
async function fetchRemoteActor(id) {
  return fetch(new URL(id))
  .then(res => res.json())
  .then(json => new Application(json))
  .catch(err => {
    log.error(err)
    throw new Error(`Unable to fetch actor`)
  })
}

/**
 * 
 * @type {express.RequestHandler}
 */
async function checkActivityPubRequest(req, res, next) {
  if (req.headers['content-type'] === 'application/activity+json') {
    /** @type {ParsedHTTPSignature} */
    // @ts-ignore
    const parsed = httpSignature.parseRequest(req)

    debug(parsed.keyId)
    const key = (await fetchRemoteActor(parsed.keyId)).publicKey.publicKeyPem
    const validHTTPSignature = httpSignature.verifySignature(parsed, key)
    debug(`Signature is valid: ${validHTTPSignature}`)
    req.headers['x-activity-pub-request'] = 'true'
    debug(req.body)
    return next()
  }

  req.headers['x-activity-pub-request'] = 'false'
  next()
}

/**
 * 
 * @type {express.ErrorRequestHandler}
 */
function errorHandler (err, req, res, next) {
  res.status(500)
  res.render('error', { error: err })
}
//#endregion Methods

//#region Middleware
app.use((req, res, next) => {
  log.info(`${req.method} ${req.path}`)
  next()
})
app.use(express.json({ type: 'application/activity+json' }))

app.use(checkActivityPubRequest)

app.use((req, res, next) => {
  log.info(`Is valid ActivityPub request: ${req.headers['x-activity-pub-request']}`)
  next()
})
//#endregion Middleware

//#region Routes

app.use('/api', apiRouter)

//#endregion Routes

//#region Static Handler
app.use(express.static('public'))
//#endregion Static Handler

//#region Error Middleware
app.use(errorHandler)
//#endregion Error Middleware

//#region 404 Handler
app.use((req, res) => {
  res.status(404).send("Sorry can't find that!")
})
//#endregion 404 Handler

//#region Setup
const publicCollection = new Collection('https://www.w3.org/ns/activitystreams#Public')

const connectionManager = ObjectManager.getObjectManager()
connectionManager.add(publicCollection)

const defaultPublicKey = readFileSync('data/public_key.pem').toString('utf8')

const applicationInbox = new Collection('http://mc.drazisil.com:9000/actor/inbox')
const applicationOutbot = new Collection('http://mc.drazisil.com:9000/actor/outbox')

const application = {
  '@context': "https://www.w3.org/ns/activitystreams",
  id: 'http://mc.drazisil.com:9000/actor',
  type: 'Application',
  publicKey: {
    publicKeyPem: defaultPublicKey
  }
}

connectionManager.add(application)

//#endregion Setup

//#region Serve
app.listen(port, () => {
  log.info(`${appName} app listening on port ${port}`)
})
//#endregion Serve
