import express from 'express'
import createDebug from 'debug'
import { createLogger } from 'bunyan'
import httpSignature from 'http-signature'
import { apiRouter } from './src/routers/index.js'
import { CollectionManager } from './src/CollectionManager.js'
import { Collection } from './src/Collection.js'
import { ActivityPubObject } from './src/ActivityPubObject.js'


//#region Config
const appName = 'toot-sweet'
const port = 9000
//#endregion Config

//#region Init
const debug = createDebug('toot-sweet')
const log = createLogger({ name: appName })
const app = express()
/**
 * @class Actor
 * @extends {ActivityPubObject}
 * @property {Object} publicKey
 * @property {string} publicKey.publicKeyPem
 */
class Actor extends ActivityPubObject {
  publicKey = {
    publicKeyPem: ''
  }

  /**
   * 
   * @param {Object} param0 
   * @param {string} param0.id
   * @param {object} param0.publicKey
   * @param {string} param0.publicKey.publicKeyPem
   */
  constructor ({id, publicKey}) {
    super(id, 'Actor')
    this.publicKey = publicKey
  }
}
//#endregion Init
//#region Types
/**
 * @typedef {Object} ParsedHTTPSignature
 * @property {string} keyId
*/
//#endregion Types

//#endregion Classes

//#region Methods
/**
 * Fetch an Actor object
 * @param {string} id 
 * @returns {Promise<Actor>}
*/
async function fetchActor(id) {
  return fetch(new URL(id))
  .then(res => res.json())
  .then(json => new Actor(json))
  .catch(err => {
    log.error(err)
    throw new Error(`Unable to fetch actor`)
  })
}

/**
 * 
 * @type {express.RequestHandler}
 */
async function handleActivityPubRequest(req, res, next) {
  if (req.headers['content-type'] === 'application/activity+json') {
    /** @type {ParsedHTTPSignature} */
    // @ts-ignore
    const parsed = httpSignature.parseRequest(req)


    debug(parsed.keyId)
    const key = (await fetchActor(parsed.keyId)).publicKey.publicKeyPem
    const validHTTPSignature = httpSignature.verifySignature(parsed, key)
    debug(`Signature is valid: ${validHTTPSignature}`)

    debug(req.body)
  }
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

app.use(handleActivityPubRequest)
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

const connectionManager = CollectionManager.getCollectionManager()
connectionManager.add(publicCollection)

//#endregion Setup

//#region Serve
app.listen(port, () => {
  log.info(`${appName} app listening on port ${port}`)
})
//#endregion Serve
