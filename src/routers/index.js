import express, { response } from 'express'
import createDebug from 'debug'
import { createLogger } from 'bunyan'
import { CollectionManager } from '../CollectionManager.js'

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

  apiRouter.get('/_all_docs', (req, res) => {
    const manager = CollectionManager.getCollectionManager()
    res.json(manager.list())
    res.end()
  })

  //#region 404 Handler
apiRouter.use((req, res) => {
    res.status(404).send("Opps")
  })
  //#endregion 404 Handlers