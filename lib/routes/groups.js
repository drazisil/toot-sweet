import express from "express"
import { Grouper } from "../Grouper.js"

const router = express.Router()

router.get("/getAll", (request, res) => {
  const groups = Grouper.getGrouper()

  res.setHeader('content-type', 'application/json')

  const allItems = groups.getAll()

  res.json(allItems)
})


export  {router as groupsRouter}
