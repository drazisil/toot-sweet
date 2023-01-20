import { RequestWithBody } from "../RequestInfo.js";
import { json404 } from './json404.js';
import { PeopleConnector } from './PeopleConnector.js';

/**
 *
 * @param {RequestWithBody} requestWithBody
 */
export function handleActivityStreamRequest(requestWithBody) {

  if (requestWithBody.requestInfo.url.startsWith("/people")) {
    const usersController = new PeopleConnector()
    const user = usersController.respondUser(requestWithBody)
    requestWithBody.requestInfo.response.setHeader("content-type", 'application/activity+json');

    return requestWithBody.requestInfo.response.end(JSON.stringify(user));
  }

  return json404(requestWithBody);
}


