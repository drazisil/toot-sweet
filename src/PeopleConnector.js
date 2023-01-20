import { readFileSync } from 'node:fs';
import { RequestWithBody } from "../RequestInfo.js";
import { ActivityStreamObject } from "./ActivityStreamObject.js";

export class Person extends ActivityStreamObject {
  /** @type {string} */
  name = "";

  /** @type {string} */
  preferredUsername = ""

  /** @type {string} */
  inbox = ""

  /** @type {string} */
  outbox = ""

  publicKey = {
    /** @type {string} */
    id: "",
    /** @type {string} */
    owner: "",
    /** @type {string} */
    publicKeyPem: ""
  }
}

export class PeopleConnector {
  baseUser = "https://mc.drazisil.com/users/drazi";
  /**
   *
   * @param {RequestWithBody} requestWithBody
   */
  respondUser(requestWithBody) {
    const publicKeyPem = readFileSync('data/dev-key.pem', { encoding: "utf8" });

    /** @type {Person} */
    const response = {
      "@context": ["https://www.w3.org/ns/activitystreams", "https://w3id.org/security/v1"],
      "id": this.baseUser,
      "type": "Person",
      "name": "Drazi Test",
      "preferredUsername": "drazi",
      "inbox": this.baseUser.concat("/inbox"),
      "outbox": this.baseUser.concat("/outbox"),
      "publicKey": {
        "id": this.baseUser.concat("#main-key"),
        "owner": this.baseUser,
        "publicKeyPem": publicKeyPem
      }
    };
  }
}
