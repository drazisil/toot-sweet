import express from "express"
import { Grouper } from "../Grouper.js"

const router = express.Router()

router.get("/getAll", (request, response) => {
  const groups = Grouper.getGrouper()

  response.setHeader('content-type', 'application/json')

  const allItems = groups.getAll()

  return response.end(JSON.stringify(allItems))
})


export  {router as groupsRouter}
