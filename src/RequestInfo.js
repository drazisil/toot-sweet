import log from './log.js';

/**
 * @class RequestInfo
 */


export class RequestInfo {
  /** @type {import("node:http").IncomingHttpHeaders} */
  headers;

  /** @type {string} */
  method;

  /** @type {string} */
  url;

  /** @type {import("node:http").ServerResponse} */
  response;

  /**
   *
   * @param {import("node:http").IncomingHttpHeaders} headers
   * @param {string} method
   * @param {string} url
   * @param {import("node:http").ServerResponse} response
   * @throws {Error} - when url is undefined
   */
  constructor(headers, method = '', url = '', response) {
    this.headers = headers;
    this.method = method;
    this.url = url;
    this.response = response;

    if (typeof this.url === "undefined") {
      log.error({ "reason": "Unable to parse request URL" });
      throw new Error("Unable to parse request URL");
    }
  }

  /**
   *
   * @param {import("node:http").IncomingHttpHeaders} headers
   * @param {string | undefined} method
   * @param {string | undefined} url
   * @param {import("node:http").ServerResponse} response
   * @returns RequestInfo
   */
  static toRequestInfo(headers, method, url, response) {
    return new RequestInfo(headers, method, url, response);
  }

  toString() {
    return JSON.stringify({
      headers: this.headers,
      method: this.method,
      url: this.url
    });
  }
}
/**
 * @class
 * @param {string} requestId
 * @property {RequestInfo} requestInfo
 * @property {string} body
 */

export class RequestWithBody {
  /** @type {string} */
  id;

  /** @type {RequestInfo} */
  requestInfo;

  /** @type {string} */
  url;

  /** @type {string} */
  body;

  /**
   *
   * @param {string} requestId
   * @param {RequestInfo} requestInfo
   * @param {string} body
   */
  constructor(requestId, requestInfo, body) {
    this.id = requestId;
    this.requestInfo = requestInfo;
    this.url = requestInfo.url;
    this.body = body;


  }

  /**
   *
   * @param {string} requestId
   * @param {RequestInfo} requestInfo
   * @param {string} body
   * @returns RequestWithBody
   */
  static toRequestWithBody(requestId, requestInfo, body) {
    return new RequestWithBody(requestId, requestInfo, body);
  }

  toString() {
    return JSON.stringify({
      requestInfo: JSON.parse(this.requestInfo.toString()),
      url: this.requestInfo.url,
      body: this.body
    });
  }
}
