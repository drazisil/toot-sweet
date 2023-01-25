import { json404 } from './json404.js';
import { PeopleConnector } from './PeopleConnector.js';

/**
 *
 * @param {import("./RequestInfo.js").RequestWithBody} requestWithBody
 */

export async function handlePeopleRequest(requestWithBody) {
  const parts = requestWithBody.url.split("/");
  const people = new PeopleConnector();

  const person = people.findPerson(parts[0]);

  if (typeof person === "undefined") {
    return json404(requestWithBody.requestInfo.response);
  }

  requestWithBody.requestInfo.response.setHeader("content-type", 'application/activity+json');

  return requestWithBody.requestInfo.response.end(JSON.stringify(person));
}
