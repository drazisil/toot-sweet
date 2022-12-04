import express from "express";
import { ActivityPubJSON } from "../handlers.js";
export declare function relayFollowRequest(activity: ActivityPubJSON, res: express.Response): Promise<void>;
