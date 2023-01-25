import { readFileSync } from 'node:fs';
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
  /** @type {PeopleConnector} */
  static _instance


  baseUser = "https://mc.drazisil.com";

  /** @type {Person[]} */
  people = []

  /**
   *
   * @param {string} person
   * @returns {Person | undefined}
   */
  findPerson(person) {
    return this.people.find(p => {
      return p.preferredUsername === person
    })
  }

  constructor() {
    const publicKeyPem = readFileSync('data/dev-key.pem', { encoding: "utf8" });

    this.people.push({
      "@context": ["https://www.w3.org/ns/activitystreams", "https://w3id.org/security/v1"],
      "id": this.baseUser.concat("/people/drazi"),
      "type": "Person",
      "name": "Drazi TootSweet",
      "preferredUsername": "drazi",
      "inbox": this.baseUser.concat("/people/drazi/inbox"),
      "outbox": this.baseUser.concat("/people/drazi/outbox"),
      "publicKey": {
        "id": this.baseUser.concat("/people/drazi#main-key"),
        "owner": this.baseUser,
        "publicKeyPem": publicKeyPem
      }
    })

    this.people.push({
      "@context": ["https://www.w3.org/ns/activitystreams", "https://w3id.org/security/v1"],
      "id": this.baseUser.concat("/people/self"),
      "type": "Person",
      "name": "mc.drazisil.com",
      "preferredUsername": "self",
      "inbox": this.baseUser.concat("/people/self/inbox"),
      "outbox": this.baseUser.concat("/people/self/outbox"),
      "publicKey": {
        "id": this.baseUser.concat("/people/self#main-key"),
        "owner": this.baseUser,
        "publicKeyPem": publicKeyPem
      }
    })
  }

    /**
   *
   * @returns {PeopleConnector}
   */
    static getPeopleConnector() {
      if (typeof PeopleConnector._instance === "undefined") {
        PeopleConnector._instance = new PeopleConnector()
      }

      return PeopleConnector._instance
    }
}
