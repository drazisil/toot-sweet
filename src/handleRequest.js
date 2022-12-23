/**
 *
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 */
export function handleRequest(req, res) {
  console.dir(req.headers);
  console.debug(req.method);
  console.debug(req.url);
}
