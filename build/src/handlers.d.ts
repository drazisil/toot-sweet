import express from "express";
export interface ActivityPubJSON {
    "@context": string;
    type: string;
    id: string;
    object: string;
}
export declare class ActivityError extends Error {
    activity: Object;
    constructor(message: string, activity: Object);
}
export declare function getActivityTargetType(inputJson: ActivityPubJSON): string;
export declare function handle(req: express.Request, res: express.Response): Promise<void>;
