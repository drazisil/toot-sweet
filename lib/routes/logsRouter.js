import express from "express";
import { Queue } from "../Queue.js";

const router = express.Router();

router.get("/getAll", (request, res) => {
  const logQueue = Queue.getQueue();

  res.setHeader("content-type", "application/json");

  const allItems = logQueue.getAll();

  res.json(allItems);
});

export { router as logsRouter };
