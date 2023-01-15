import log from '../log.js';
import { json404 } from './json404.js';

/**
 * @typedef {object} WebFingerLink
 * @property {string} rel
 * @property {string} type
 * @property {string} href
 */

/**
 * @global
 * @typedef {object} WebFingerAccount
 * @property {string} subject
 * @property {string[]} aliases
 * @property {object} [properties]
 * @property {WebFingerLink[]} links
 */

export class WebFingerAccountManager {

  /** @type {WebFingerAccountManager} */
  static _instance

  /** @type {WebFingerAccount[]} */
  accounts = []

  constructor() {
    this.add(
      {
        subject: "acct:drazi@mc.drazisil.com",
        aliases: [],
        links: [
          {
            rel: 'self',
            type: 'application/activity+json',
            href: 'https://mc.drazisil.com/users/drazi'
          }
        ]
      }
    )
    this.add(
      {
        subject: "acct:mc.drazisil.com@mc.drazisil.com",
        aliases: [],
        links: [
          {
            rel: 'self',
            type: 'application/activity+json',
            href: 'https://mc.drazisil.com/users/drazi'
          }
        ]
      }
    )
  }

  /**
   * 
   * @returns {WebFingerAccountManager}
   */
  static getAccountManager() {
    if (typeof WebFingerAccountManager._instance === "undefined") {
      WebFingerAccountManager._instance = new WebFingerAccountManager()
    }

    return WebFingerAccountManager._instance
  }

  /**
   * 
   * @param {WebFingerAccount} newAccount 
   */
  add(newAccount) {
    this.accounts.push(newAccount)
  
  }
  /**
   * 
   * @param {string} subject 
   * @returns {WebFingerAccount | undefined}
   */
  find(subject) {
    return this.accounts.find(account => {
      return account.subject === subject
    })
  }
}



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

  const accountManager = WebFingerAccountManager.getAccountManager()

  let cleanedRequestedResource = requestedResource

  if (accountAndType?.account.startsWith("@")) {
    cleanedRequestedResource = "acct:".concat(accountAndType.account.substring(1), accountAndType.account)
  }

  log.info(cleanedRequestedResource)

  const accountRecord = accountManager.find(cleanedRequestedResource)

  if (typeof accountRecord === "undefined") {
    log.error('Record not found');
    return json404(requestWithBody, 'Record not found');
  }
  log.info(JSON.stringify(accountRecord))
  requestWithBody.requestInfo.response.setHeader('content-type', 'application/json')
  return requestWithBody.requestInfo.response.end(JSON.stringify(accountRecord))

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
