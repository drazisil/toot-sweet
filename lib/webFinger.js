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
  static _instance;

  /** @type {WebFingerAccount[]} */
  accounts = [];

  /** @type {import("./config.js").Env} */
  _config;

  /**
   *
   * @param {import("./config.js").Env} config
   */
  constructor(config) {
    this._config = config;
    this.add({
      subject: `acct:drazi@${this._config.siteHost}`,
      aliases: [],
      links: [
        {
          rel: "self",
          type: "application/activity+json",
          href: `https://${this._config.siteHost}/people/drazi`,
        },
      ],
    });
    this.add({
      subject: `acct:@${this._config.siteHost}`,
      aliases: [],
      links: [
        {
          rel: "self",
          type: "application/activity+json",
          href: `https://${this._config.siteHost}/people/self`,
        },
      ],
    });
  }

  /**
   *
   * @param {import("./config.js").Env} config
   * @returns {WebFingerAccountManager}
   */
  static getAccountManager(config) {
    if (!WebFingerAccountManager._instance) {
      WebFingerAccountManager._instance = new WebFingerAccountManager(config);
    }
    const self = WebFingerAccountManager._instance;
    return self;
  }

  /**
   *
   * @param {WebFingerAccount} newAccount
   */
  add(newAccount) {
    this.accounts.push(newAccount);
  }
  /**
   *
   * @param {string} subject
   * @returns {WebFingerAccount | undefined}
   */
  find(subject) {
    return this.accounts.find((account) => {
      return account.subject === subject;
    });
  }
}
