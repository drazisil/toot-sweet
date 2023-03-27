import { createPublicKey } from "node:crypto";
import { readFileSync } from "node:fs";
import { Grouper } from "./Grouper.js";
import log from "./logger.js";

export class PeopleConnector {
  /** @type {PeopleConnector} */
  static _instance;

  personURIBase;

  /** @type {import("./models/Person.js").PersonRecord[]} */
  people = [];

  /**
   *
   * @param {string} person
   * @returns {import("./models/Person.js").PersonRecord | undefined}
   */
  findPerson(person) {
    return this.people.find((p) => {
      return p.preferredUsername === person;
    });
  }

  /**
   *
   * @param {import("./config.js").Env} config
   */
  constructor(config) {
    this.personURIBase = `https://${config.siteHost}`;

    this.addPerson("drazi");

    this.addPerson("self");
  }

  /**
   * Add a user to the internal list
   * @param {string} personId
   * @param {string} [personName]
   */
  addPerson(personId, personName = undefined) {
    const privateKey = readFileSync(
      "data/global/production/account-identity.pem",
      "utf8"
    );

    const publicKeyPem = createPublicKey(privateKey)
      .export({ format: "pem", type: "pkcs1" })
      .toString("utf8");

    /** @type {string} */
    personName = personName ?? personId;

    this.people.push({
      "@context": [
        "https://www.w3.org/ns/activitystreams",
        "https://w3id.org/security/v1",
      ],
      id: this.personURIBase.concat(`/people/${personId}`),
      type: "Person",
      name: personName,
      preferredUsername: personId,
      inbox: this.personURIBase.concat(`/people/${personId}/inbox`),
      outbox: this.personURIBase.concat(`/people/${personId}/outbox`),
      publicKey: {
        id: this.personURIBase.concat(`people/${personId}#main-key`),
        owner: this.personURIBase,
        publicKeyPem: publicKeyPem,
      },
    });

    const grouper = Grouper.getGrouper();

    grouper.createGroup(`${personId}.inbox`);
    grouper.createGroup(`${personId}.outbox`);
    grouper.createGroup(`${personId}.statuses`);
  }

  /**
   *
   * @param {import("./config.js").Env} config
   * @returns {PeopleConnector}
   */
  static getPeopleConnector(config) {
    if (!PeopleConnector._instance) {
      PeopleConnector._instance = new PeopleConnector(config);
    }

    const self = PeopleConnector._instance;
    return self;
  }
}

/**
 * Fetch an Actor object
 * @param {string} id
 * @returns {Promise<import("./models/Person.js").Person>}
 */
export async function fetchRemoteActor(id) {
  return fetch(new URL(id), {
    headers: [["Accept", "application/activity+json"]],
  })
    .then(async (res) => {
      return res.json()
    })
    .catch((err) => {
      log.error(err);
      throw new Error(`Unable to fetch actor`);
    });
}
