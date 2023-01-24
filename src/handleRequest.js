import log from './log.js';
import { json404 } from './json404.js';
import { handlePeopleRequest } from '../app';

/**
 *
 * @param {import("./RequestInfo.js").RequestWithBody} requestWithBody
 */

export async function handleRequest(requestWithBody) {
  log.info({ "method": requestWithBody.requestInfo.method, "url": requestWithBody.url, "headers": requestWithBody.requestInfo.headers, "body": requestWithBody.body });


  requestWithBody.url = requestWithBody.url.substring(1);

  if (requestWithBody.url.startsWith("people")) {
    requestWithBody.url = requestWithBody.url.replace("people/", "");
    return handlePeopleRequest(requestWithBody);
  }

  return json404(requestWithBody.requestInfo.response);

}
