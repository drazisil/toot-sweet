import https from '@small-tech/https'
import log from './src/logger.js'
import createExpress from "express"
import { addExpressMiddleware } from './src/addExpressMiddleware.js'

const app = createExpress()

export const ROOT_DOMAIN = "mc.drazisil.com"

const options = {
  domains: [ROOT_DOMAIN],
  settingsPath: "data"
}

addExpressMiddleware(app)

try {

  const server = https.createServer(options, app)

  server.listen(443, () => {
    log.info(Object({ "server": { "status": "listening" } }))
  })

  server.on("error", (/** @type {unknown} */ err) => {
    log.error(Object({ "server": { "status": "errored", "reason": String(err) } }))
  })
} catch (error) {
  log.error({"reason": `Fatal error!: ${{error}}`})
  process.exit(-1)
}


