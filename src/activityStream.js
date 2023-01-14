import { RequestWithBody } from '../app.js';
import log from '../log.js';
import { json404 } from './json404.js';

/**
 * @typedef {string | undefined} OptionalString
 */

export class ActivityStreamObject {
  /** @type {"https://www.w3.org/ns/activitystreams"} */
  "@context" = "https://www.w3.org/ns/activitystreams"
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
    /** @type {ActivityStreamObject | Record<string, string>} */
    const response = {
      "@context": "https://www.w3.org/ns/activitystreams",
      "id": this.baseUser,
      "type": "Person",
      "inbox": this.baseUser.concat("/inbox"),
      "outbot": this.baseUser.concat("/outbox"),
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


