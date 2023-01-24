import { randomUUID } from 'crypto';
import { RequestInfo, RequestWithBody } from './RequestInfo.js';
import { handleRequest } from "./handleRequest";

/**
 *
 * @param {import("node:http").IncomingMessage} request
 * @param {import("node:http").ServerResponse} response
 */
export function requestListener(request, response) {
  /** @type {RequestInfo} */
  const requestInfo = RequestInfo.toRequestInfo(request.headers, request.method, request.url, response);

  let body = '';

  request.setEncoding("utf8");
  request.on("data", (/** @type {string} */ chunk) => {
    body = body.concat(chunk);
  });

  request.on("end", () => {
    const requestId = randomUUID();
    /** @type {RequestWithBody} */
    const requestWithBody = RequestWithBody.toRequestWithBody(requestId, requestInfo, body);

    handleRequest(requestWithBody);
  });
}
