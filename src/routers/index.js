import express, { response } from 'express'
import createDebug from 'debug'
import { createLogger } from 'bunyan'

//#region Config
const appName = 'toot-sweet'
//#endregion Config

//#region Init
const debug = createDebug('toot-sweet')
const log = createLogger({ name: appName })
export const apiRouter = express.Router()
//#endregion Init

apiRouter.use((req, res, next) => {
    log.info(`API: ${req.method} ${req.path}`)
    next()
  })

  apiRouter.get('/', (req, res) => {
    res.end('Hi')
  })