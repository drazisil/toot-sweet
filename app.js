import bootStrap from './src/bootstrap.js'

import { readFileSync } from 'fs'
import * as http from 'node:http'
import * as https from 'node:https'
import log from './log.js'
import { handleWebFingerRequest } from './src/webFinger.js'
import { handleActivityStreamRequest } from './src/activityStream.js'


/**
 * @class RequestInfo
 */
export class RequestInfo {
  /** @type {http.IncomingHttpHeaders} */
  headers;

  /** @type {string} */
  method;

  /** @type {string} */
  url;

  /** @type {http.ServerResponse} */
  response;

  /**
   * 
   * @param {http.IncomingHttpHeaders} headers 
   * @param {string} method
   * @param {string} url
   * @param {http.ServerResponse} response 
   */
  constructor(headers, method = '', url = '', response) {
    this.headers = headers
    this.method = method
    this.url = url
    this.response = response
  }

  /**
   * 
   * @param {http.IncomingHttpHeaders} headers 
   * @param {string | undefined} method 
   * @param {string | undefined} url 
   * @param {http.ServerResponse} response 
   * @returns RequestInfo
   */
  static toRequestInfo(headers, method, url, response) {
    return new RequestInfo(headers, method, url, response)
  }

  toString() {
    return JSON.stringify({
      headers: this.headers,
      method: this.method,
      url: this.url
    })
  }
}

/**
 * @class
 * @property {RequestInfo} requestInfo
 * @property {string} body
 */
export class RequestWithBody {
  /** @type {RequestInfo} */
  requestInfo;

  /** @type {string} */
  body;

  /**
   * 
   * @param {RequestInfo} requestInfo 
   * @param {string} body 
   */
  constructor(requestInfo, body) {
    this.requestInfo = requestInfo
    this.body = body
  }

  /**
   * 
   * @param {RequestInfo} requestInfo 
   * @param {string} body 
   * @returns RequestWithBody
   */
  static toRequestWithBody(requestInfo, body) {
    return new RequestWithBody(requestInfo, body)
  }

  toString() {
    return JSON.stringify({
      requestInfo: JSON.parse(this.requestInfo.toString()),
      body: this.body
    })
  }
}

/**
 * 
 * @param {RequestWithBody} requestWithBody 
 */
async function handleRequest(requestWithBody) {
  log.info(`Request: ${requestWithBody}}`)

  if (requestWithBody.requestInfo.url?.startsWith('/.well-known/webfinger?resource=acct:')) {
    // Handle WebFinger request
    log.info('WebFinger')
    handleWebFingerRequest(requestWithBody)
  }

  if (requestWithBody.requestInfo.headers['content-type'] === 'application/activity+json'
    || requestWithBody.requestInfo.headers['accept']?.includes("application/activity+json")
    || requestWithBody.requestInfo.url.includes('type=jsonTest')) {
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
  /** @type {RequestInfo} */
  const requestInfo = RequestInfo.toRequestInfo(request.headers, request.method, request.url, response)

  let body = '';

  request.setEncoding("utf8")
  request.on("data", (/** @type {string} */ chunk) => {
    body = body.concat(chunk)
  })

  request.on("end", () => {
    /** @type {RequestWithBody} */
    const requestWithBody = RequestWithBody.toRequestWithBody(requestInfo, body)

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

server.on("error", (/** @type {unknown} */ err) => {
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

