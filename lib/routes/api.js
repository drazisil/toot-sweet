import express from "express";
import logRouter from "./log.js";
import groupsRouter from "./groups.js";

const router = express.Router();

router.use("/log", logRouter);

router.use("/groups", groupsRouter);

router.use("/v1", (request, response) => {
  return response.sendStatus(404);
});

export default router;
