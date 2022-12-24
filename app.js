import express from 'express'
import createDebug from 'debug'
import { createLogger } from 'bunyan'
import httpSignature from 'http-signature'
import { apiRouter } from './src/routers/index.js'

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

/**
 * @typedef {Object} ActivityPubLink
*/
//#endregion Types

//#region Classes
/**
 * @class {Object} ActivityPubObject
 * @property {string} context - Mapped externally as "@context"
 * @property {string} id
 * @property {string} type
 */
class ActivityPubObject {
  '@context' = "https://www.w3.org/ns/activitystreams"
  /** @type {string} */
  id;
  /** @type {string} */
  type;

  /** 
   * @construct
   * @param {string} id
   * @param {string} type
   */
  constructor(id, type) {
    this.id = id
    this.type = type
  }
}

/**
 * @class Collection
 * @extends {ActivityPubObject}
 * @property {number} totalItems
 * @property {CollectionPage | ActivityPubLink} current
 * @property {CollectionPage | ActivityPubLink} first
 * @property {CollectionPage | ActivityPubLink} last
 * @property {ActivityPubObject | ActivityPubLink | ActivityPubObject[] | ActivityPubLink[]} items
*/
class Collection extends ActivityPubObject {
  number = 0
  /** @type {CollectionPage | ActivityPubLink | undefined} */
  first
  /** @type {CollectionPage | ActivityPubLink | undefined} */
  last
  /** @type {ActivityPubObject | ActivityPubLink | ActivityPubObject[] | ActivityPubLink[]} */
  items = []

  /**
   * 
   * @param {string} id 
   */
  constructor(id) {
    super(id, 'Collection')
  }
}

/**
 * @class CollectionPage
 * @extends {Collection}
 * @property {Link | Collection} partOf
 * @property {CollectionPage | ActivityPubLink} next
 * @property {CollectionPage | ActivityPubLink} prev
 */
class CollectionPage extends Collection {
  /** @type {ActivityPubLink | Collection | undefined} */
  partOf
  /** @type {CollectionPage | ActivityPubLink | undefined} */
  next
  /** @type {CollectionPage | ActivityPubLink | undefined} */
  prev
}

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

class CollectionManager {
  /** @type {Collection[]} */
  collections = []

  /**
   * Add a new collection
   * @param {Collection} newConnection 
   */
  add(newConnection) {
    this.collections.push(newConnection)
  }

  /**
   * Find a connection by id
   * @param {string} id 
   * @returns {Collection | undefined}
   */
  find(id) {
    return this.collections.find(collection => {
      collection.id === id
    })
  }

  /**
   * List all collections
   * @returns {Collection[]}
   */
  list() {
    return this.collections
  }

  /**
   * 
   * @param {string} id 
   * @param {Collection} updatedCollection 
   * @throws {Error} - Collection not found
   */
  update(id, updatedCollection) {
    const index = this.collections.findIndex(collection => {
      collection.id === id
    })
    if (index < 0) {
      throw new Error('Collection not found')
    }
    this.collections[index] = updatedCollection
  }

  /**
   * Remove a collection by id
   * @param {string} id 
   */
  remove(id) {
    const updatedCollections = this.collections.filter(collection => {
      collection.id !== id
    })
    this.collections = updatedCollections
  }
}
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
//#endregion 404 Handlers

//#region Setup
const publicCollection = new Collection('https://www.w3.org/ns/activitystreams#Public')

const connectionManager = new CollectionManager()
connectionManager.add(publicCollection)

//#endregion Setup

//#region Serve
app.listen(port, () => {
  log.info(`${appName} app listening on port ${port}`)
})
//#endregion Serve
