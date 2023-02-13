import express from "express";
import logRouter from "./log.js";
import groupsRouter from "./groups.js";

const router = express.Router();

router.use("/log", logRouter);

router.use("/groups", groupsRouter);

export default router;
