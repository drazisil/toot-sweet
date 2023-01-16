import { readFileSync } from 'node:fs';
import { RequestWithBody } from '../app.js';
import log from '../log.js';
import { json404 } from './json404.js';

/**
 * @typedef {string | undefined} OptionalString
 */

export class ActivityStreamObject {
  /** @type {string | string[]} */
  "@context" = ["https://www.w3.org/ns/activitystreams"]
  /** @type {string} */
  id = ""
  /** @type {string} */
  type = ""
}

export class UsersController {
  baseUser = "https://mc.drazisil.com/users/drazi"
  /**
   * 
   * @param {RequestWithBody} requestWithBody 
   */
  respondUser(requestWithBody) {
    const publicKeyPem = readFileSync('data/dev-key.pem', { encoding: "utf8" })

    /** @type {ActivityStreamObject | Record<string, string>} */
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
    }
    requestWithBody.requestInfo.response.setHeader("content-type", 'application/activity+json')

    return requestWithBody.requestInfo.response.end(JSON.stringify(response))
  }
}


/**
 *
 * @param {RequestWithBody} requestWithBody
 */
export function handleActivityStreamRequest(requestWithBody) {
  log.info(`ActivityStream request for ${requestWithBody.requestInfo.url}`);

  if (requestWithBody.requestInfo.url.startsWith("/users")) {
    log.info("Asked for a user")
    const usersController = new UsersController()
    return usersController.respondUser(requestWithBody)
  }

  return json404(requestWithBody);
}


