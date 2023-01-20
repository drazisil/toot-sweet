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
  baseUser = "https://mc.drazisil.com/people/drazi";

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
    })
  }
}
