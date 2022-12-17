/**
 * @typedef {{body: string, statusCode: string, headers?: import('node:http').OutgoingHttpHeaders | import('node:http').OutgoingHttpHeader[]}} HandledRequest
 */

import { randomUUID } from 'node:crypto';
import { parse } from 'node:url';
import { format } from 'node:util';

/**
 * @typedef {{
 *   '@context'?: string, 
 *   type?: string,
 *   id?: string
 *   actor?: string,
 *   object?: string
 * }} ActivityStreamsJSON
 */
/**
 *
 * @param {ActivityStreamsJSON} activityStreamsJSON
 * @param {import('node:http').IncomingHttpHeaders} headers
 * @returns {Promise<HandledRequest | null>}
*/
export async function handleActivityStreamJSON(activityStreamsJSON, headers) {
  console.dir(activityStreamsJSON);

  const postData = JSON.stringify({
    '@context': activityStreamsJSON['@context'],
    'id': format('http://mc.drazisil.com:9000/%s', randomUUID()),
    'type': 'Accept',
    'actor': format('http://mc.drazisil.com:9000/%s', 'actor'),
    'object': activityStreamsJSON.id
  })

  const { host, port, path} = parse(activityStreamsJSON.actor)

  /** @type {RequestInit} */
  const options = {   
    method: 'POST',
    headers: {
      'content-type': 'application/activity+json',
      'content-length': Buffer.byteLength(postData),
      'user-agent': 'toot-sweet'
    },
    redirect: 'follow',
    body: postData
  }

  console.debug('Sending accept')
  const req = await fetch(format('%s/inbox', activityStreamsJSON.actor), options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
      console.log('No more data in response.');
    });
  });

  return {
    body: '',
    statusCode: 200
  };
}
