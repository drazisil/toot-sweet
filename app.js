import {bootStrap} from './src/bootstrap.js'

import * as https from 'node:https'
import log from './src/log.js'
import createExpress from "express"
import { addExpressMiddleware } from './src/addExpressMiddleware.js'

const app = createExpress()

const port = process.env["PORT"] ?? 443

addExpressMiddleware(app)

try {

  /** @type {import('./src/bootstrap.js').InitialState} */
  const initialState = await bootStrap()


  const server = https.createServer({
    "cert": initialState.certificate,
    "key": initialState.privateKey
  }, app)

  server.listen(port, () => {
    log.info(Object({ "server": { "status": "listening", "port": String(port) } }))
  })

  server.on("error", (/** @type {unknown} */ err) => {
    log.error(Object({ "server": { "status": "errored", "reason": String(err) } }))
  })
} catch (error) {
  log.error({"reason": `Fatal error!: ${{error}}`})
  process.exit(-1)
}


