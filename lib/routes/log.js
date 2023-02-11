import express from "express"
import { Queue } from "../Queue.js"

const router = express.Router()

router.get("/getAll", (request, response) => {
  const logQueue = Queue.getQueue()

  response.setHeader('content-type', 'application/json')

  const allItems = logQueue.getAll()

  return response.end(JSON.stringify(allItems))
})


export default router
