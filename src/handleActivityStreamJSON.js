/**
 * @typedef {{body: string, statusCode: string, headers?: import('node:http').OutgoingHttpHeaders | import('node:http').OutgoingHttpHeader[]}} HandledRequest
 */

/**
 * @typedef {{'@context': string}} ActivityStreamsJSON
 */
/**
 *
 * @param {ActivityStreamsJSON} activityStreamsJSON
 * @param {import('node:http').IncomingHttpHeaders} headers
 * @returns {Promise<HandledRequest | null>}
*/
export async function handleActivityStreamJSON(activityStreamsJSON, headers) {
  console.dir(activityStreamsJSON);
  return null;
}
