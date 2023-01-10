import log from '../log.js';


/**
 *
 * @param {string} account
 * @param {string} host
 * @returns {'local' | 'remote'}
 */
function parseAccountType(account, host) {
  if (account.endsWith(host)) {
    // This is a local account
    return 'local';
  }
  // this is a remote account
  return 'remote';
}
/**
 *
 * @param {string} requestedResource
 * @param {string | undefined} host
 * @returns {{account: string, accountType: 'local' | 'remote'}}
 * @throws {Error} - when host is not defined
 */
function getAccountAndType(requestedResource, host) {
  const account = (requestedResource.split(':', 2).pop()) ?? '';

  log.info(account);

  /** @type {'local' | 'remote'} */
  let accountType;

  // I don't think this header can ever be undefined, but just in case
  if (typeof host === "undefined") {
    throw new Error('Unable to determine host header');
  }

  // I don't think this header can ever be undefined, but just in case
  if (typeof account === "undefined") {
    throw new Error('Unable to determine requested account type');
  }

  accountType = parseAccountType(account, host);
  return {
    account,
    accountType
  };
}
/**
 *
 * @param {import('../app.js').RequestWithBody} requestWithBody
 */
export function handleWebFingerRequest(requestWithBody) {

  const requestedResource = getRequestedWebFingerResource(requestWithBody);

  if (requestedResource === null) {
    log.error('Requested resource was not able to be parsed');
    requestWithBody.requestInfo.response.statusCode = 400;
    return requestWithBody.requestInfo.response.end('Requested resource was not able to be parsed');
  }

  // The host address this server recieved the request at
  const host = requestWithBody.requestInfo.headers.host;

  let accountAndType;

  if (requestedResource.startsWith('acct:')) {
    accountAndType = getAccountAndType(requestedResource, host);
  }

  if (accountAndType?.accountType === 'local') {
    log.info(`Request for a local account: ${accountAndType.account}`);
  }

}
/**
 *
 * @param {import('../app.js').RequestWithBody} requestWithBody
 * @returns {string | null}
 * @throws {Error} - when unable to parse the resource parameter
 */
function getRequestedWebFingerResource(requestWithBody) {
  try {

    const fullUrl = ['https:/', requestWithBody.requestInfo.headers.host, requestWithBody.requestInfo.url].join('/');

    const parsedURL = new URL(fullUrl);

    const requestedResource = parsedURL.searchParams.get('resource');

    log.info(requestedResource ?? '');

    return requestedResource;
  } catch (error) {
    log.error(`Unable to parse requested resource: ${String(error)}`);
    throw error;
  }
}
