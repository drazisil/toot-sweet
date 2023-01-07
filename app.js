import bootStrap from './src/bootstrap.js'

import express from 'express'
import createDebug from 'debug'
import { createLogger } from 'bunyan'
import httpSignature from 'http-signature'
import { apiRouter } from './src/routers/index.js'
import { ObjectManager } from './src/ObjectManager.js'
import { Collection } from './src/Collection.js'
import { readFileSync } from 'fs'
import { Application } from './src/Application.js'
import http from 'node:http'
import https from 'node:https'

export { }

const log = console

/**
 * @typedef {object} RequestInfo
 * @property {http.IncomingHttpHeaders} headers
 * @property {string} [method]
 * @property {string} [url]
 */

/**
 * @typedef {object} RequestWithBody
 * @property {RequestInfo} requestInfo
 * @property {string} body
 */

/**
 * 
 * @param {RequestWithBody} requestWithBody
 */
function handleWebFingerRequest(requestWithBody) {

  getRequestedWebFingerResource(requestWithBody)

  
}

/**
 * 
 * @param {RequestWithBody} requestWithBody 
 * @returns {string | null} 
 * @throws {Error} - when unable to parse the resource parameter
 */
function getRequestedWebFingerResource(requestWithBody) {
  try {

    const fullUrl = ['https:/', requestWithBody.requestInfo.headers.host, requestWithBody.requestInfo.url].join('/')

    const parsedURL = new URL(fullUrl)

    const requestedResource = parsedURL.searchParams.get('resource')

    log.info(requestedResource)

    return requestedResource
  } catch (error) {
    log.error(`Unable to parse requested resource: ${String(error)}`)
    throw error
  }
}

/**
 * 
 * @param {RequestWithBody} requestWithBody
 */
function handleActivityStreamRequest(requestWithBody) {
  
}

/**
 * 
 * @param {RequestWithBody} requestWithBody 
 */

async function handleRequest(requestWithBody) {
  log.info(requestWithBody)

  if (requestWithBody.requestInfo.url?.startsWith('/.well-known/webfinger?resource=acct:')) {
    // Handle WebFinger request
    log.info('WebFinger')
    handleWebFingerRequest(requestWithBody)
  }
  
  if (requestWithBody.requestInfo.headers['content-type'] === 'application/activity+json') {
    log.info('ActivityStream')
    handleActivityStreamRequest(requestWithBody)
  }
}


/**
 * 
 * @param {http.IncomingMessage} request 
 * @param {http.ServerResponse} response 
 */
function requestListener(request, response) {
  /**
   * @type {RequestInfo}
   */
  const requestInfo = {
    headers: request.headers,
    method: request.method,
    url: request.url
  }

  let body = '';

  request.setEncoding("utf8")
  request.on("data", (chunk) => {
    body = body.concat(chunk)
  })

  request.on("end", () => {
    /** @type {RequestWithBody} */
    const requestWithBody = {
      requestInfo,
      body
    }
    handleRequest(requestWithBody)
  })
}

await bootStrap()

let exitCode = 0

/** @type {string} */
let cert;

try {
  cert = readFileSync('data/dev-crt.pem', { encoding: "utf8" })
} catch (error) {
  log.error(`Unable to read certificate file: ${String(error)}`)
  exitCode = -1
  process.exit(exitCode)
}

/** @type {string} */
let key;

try {
  key = readFileSync('data/dev-key.pem', { encoding: "utf8" })
} catch (error) {
  log.error(`Unable to read certificate file`)
  exitCode = -1
  process.exit(exitCode)
  
}

const port = 443

const server = https.createServer({
  cert,
  key
}, requestListener)

server.listen(port, () => {
  log.info(`Server listening on port ${port}`)
})

server.on("error", (err) => {
  log.error(`Error in server: ${String(err)}`)
})


// //#region Config
// const appName = 'toot-sweet'
// const port = 9000
// //#endregion Config

// //#region Init
// const debug = createDebug('toot-sweet')
// // const log = createLogger({ name: appName })
// const app = express()
// //#endregion Init
// //#region Types
// /**
//  * @typedef {Object} ParsedHTTPSignature
//  * @property {string} keyId
// */
// //#endregion Types



// //#region Methods
// /**
//  * Fetch an Actor object
//  * @param {string} id 
//  * @returns {Promise<Application>}
// */
// async function fetchRemoteActor(id) {
//   return fetch(new URL(id))
//     .then(res => res.json())
//     .then(json => new Application(json))
//     .catch(err => {
//       log.error(err)
//       throw new Error(`Unable to fetch actor`)
//     })
// }

// /**
//  * 
//  * @type {express.RequestHandler}
//  */
// async function checkActivityPubRequest(req, res, next) {
//   if (req.headers['content-type'] === 'application/activity+json') {
//     /** @type {ParsedHTTPSignature} */
//     // @ts-ignore
//     const parsed = httpSignature.parseRequest(req)

//     debug(parsed.keyId)
//     const key = (await fetchRemoteActor(parsed.keyId)).publicKey.publicKeyPem
//     const validHTTPSignature = httpSignature.verifySignature(parsed, key)
//     debug(`Signature is valid: ${validHTTPSignature}`)
//     req.headers['x-activity-pub-request'] = 'true'
//     debug(req.body)
//     return next()
//   }

//   req.headers['x-activity-pub-request'] = 'false'
//   next()
// }

// /**
//  * 
//  * @type {express.ErrorRequestHandler}
//  */
// function errorHandler(err, req, res, next) {
//   res.status(500)
//   res.render('error', { error: err })
// }

// app.use((req, res, next) => {
//   log.info(`${req.ip} ${req.method} ${req.path}`)
//   next()
// })
// app.use(express.json({ type: 'application/activity+json' }))

// app.use(checkActivityPubRequest)

// app.use((req, res, next) => {
//   log.info(`Is valid ActivityPub request: ${req.headers['x-activity-pub-request']}`)
//   next()
// })
// //#endregion Middleware

// //#region Routes

// app.use('/api', apiRouter)

// //#endregion Routes

// //#region Static Handler
// app.use(express.static('public'))
// //#endregion Static Handler

// //#region Error Middleware
// app.use(errorHandler)
// //#endregion Error Middleware

// //#region 404 Handler
// app.use((req, res) => {
//   res.type('text/html')
//   res.status(404).send("Sorry can't find that!")
// })
// //#endregion 404 Handler

// //#region Setup
// const publicCollection = new Collection('https://www.w3.org/ns/activitystreams#Public')

// const connectionManager = ObjectManager.getObjectManager()
// connectionManager.add(publicCollection)

// const defaultPublicKey = readFileSync('data/public_key.pem').toString('utf8')

// const applicationInbox = new Collection('http://mc.drazisil.com:9000/actor/inbox')
// const applicationOutbot = new Collection('http://mc.drazisil.com:9000/actor/outbox')

// const application = {
//   '@context': "https://www.w3.org/ns/activitystreams",
//   id: 'http://mc.drazisil.com:9000/actor',
//   type: 'Application',
//   publicKey: {
//     publicKeyPem: defaultPublicKey
//   }
// }

// connectionManager.add(application)

// app.listen(port, '0.0.0.0', () => {
//   log.info(`${appName} app listening on port ${port}`)
// })

