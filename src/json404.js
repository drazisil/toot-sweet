/**
 *
 * @param {import("./RequestInfo.js").RequestWithBody} requestWithBody
 * @param {string} [reason]
 */
export function json404(requestWithBody, reason='Not found') {
  requestWithBody.requestInfo.response.statusCode = 404;
  requestWithBody.requestInfo.response.setHeader('content-type', 'application/json');
  return requestWithBody.requestInfo.response.end(JSON.stringify({
    code: 404,
    reason
  }));
}
