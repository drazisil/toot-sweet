import express from "express";
import { groupsRouter } from "./groups.js";
import { logsRouter } from "./logsRouter.js";

const router = express.Router();

router.use("/log", logsRouter);

router.use("/groups", groupsRouter);

router.use("/v1", (_request, response) => {
  return response.sendStatus(404);
});

export { router as apiRouter };
