import express from "express";
export interface ActivityPubJSON {
    '@context'?: string;
    type?: string;
    id?: string;
}
export declare function handle(req: express.Request, res: express.Response): void;
