/**
 *
 * @param {import("node:http").ServerResponse} response
 * @param {string} [reason]
 */
export function json404(response, reason='Not found') {
  response.statusCode = 404;
  response.setHeader('content-type', 'application/json');
  return response.end(JSON.stringify({
    code: 404,
    reason
  }));
}
