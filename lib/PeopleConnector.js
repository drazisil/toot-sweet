import config from "./config.js"
import { createPublicKey } from "node:crypto";
import { readFileSync } from "node:fs";
import { ActivityStreamObject } from "./ActivityStreamObject.js";
import { Grouper } from "./Grouper.js";
import log from "./logger.js";

export class Person extends ActivityStreamObject {
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

export class PeopleConnector {
  /** @type {PeopleConnector} */
  static _instance


  personURIBase = `https://${config["SITE_HOST"]}`;

  /** @type {PersonRecord[]} */
  people = []

  /**
   *
   * @param {string} person
   * @returns {PersonRecord | undefined}
   */
  findPerson(person) {
    return this.people.find(p => {
      return p.preferredUsername === person
    })
  }

  constructor() {

    this.addPerson("drazi");

    this.addPerson("self");
  }

  /**
   * Add a user to the internal list
   * @param {string} personId
   * @param {string} [personName]
   */
  addPerson(personId, personName=undefined) {
    const privateKey = readFileSync("data/global/production/account-identity.pem", "utf8")

    const publicKeyPem = createPublicKey(privateKey).export({ format: "pem", type: "pkcs1" }).toString("utf8")

    /** @type {string} */
    personName = personName ?? personId

    this.people.push({
      "@context": ["https://www.w3.org/ns/activitystreams", "https://w3id.org/security/v1"],
      "id": this.personURIBase.concat(`/people/${personId}`),
      "type": "Person",
      "name": personName,
      "preferredUsername": personId,
      "inbox": this.personURIBase.concat(`/people/${personId}/inbox`),
      "outbox": this.personURIBase.concat(`/people/${personId}/outbox`),
      "publicKey": {
        "id": this.personURIBase.concat(`people/${personId}#main-key`),
        "owner": this.personURIBase,
        "publicKeyPem": publicKeyPem
      }
    });

    const grouper = Grouper.getGrouper();

    grouper.createGroup(`${personId}.inbox`);
    grouper.createGroup(`${personId}.outbox`);
    grouper.createGroup(`${personId}.statuses`);

  }

    /**
   *
   * @returns {PeopleConnector}
   */
    static getPeopleConnector() {
      if (!PeopleConnector._instance) {
        PeopleConnector._instance = new PeopleConnector()
      }

      const self = PeopleConnector._instance
      return self
    }
}

/**
 * Fetch an Actor object
 * @param {string} id
 * @returns {Promise<Person>}
*/
export async function fetchRemoteActor(id) {
  return fetch(new URL(id), {
    headers: [["Accept", "application/activity+json"]]
  })
    .then(res => res.json())
    .catch(err => {
      log.error(err)
      throw new Error(`Unable to fetch actor`)
    })
}
