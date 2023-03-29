import { ActivityStreamObject } from "../ActivityStreamObject.js";

/**
 * @global
 * @typedef {{
 *    ["@context"]: string | string[];
 *    "preferredUsername": string;
 *    "id": string;
 *    "type": string;
 *    "name": string;
 *    "inbox": string;
 *    "outbox": string;
 *    "publicKey": {
 *      "id": string;
 *      "owner": string;
 *      "publicKeyPem": string;
 *    };
 * }} PersonRecord
 */

export class Person extends ActivityStreamObject {
  /** @type {string} */
  preferredUsername = "";

  /** @type {string} */
  inbox = "";

  /** @type {string} */
  outbox = "";

  publicKey = {
    /** @type {string} */
    id: "",
    /** @type {string} */
    owner: "",
    /** @type {string} */
    publicKeyPem: "",
  };
}
