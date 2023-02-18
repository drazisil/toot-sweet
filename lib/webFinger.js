import config from "./config.js"

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
        subject: `acct:drazi@${config["SITE_HOST"]}`,
        aliases: [],
        links: [
          {
            rel: 'self',
            type: 'application/activity+json',
            href: `https://${config["SITE_HOST"]}/people/drazi`
          }
        ]
      }
    )
    this.add(
      {
        subject: `acct:@${config["SITE_HOST"]}`,
        aliases: [],
        links: [
          {
            rel: 'self',
            type: 'application/activity+json',
            href: `https://${config["SITE_HOST"]}/people/self`
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
    if (!WebFingerAccountManager._instance) {
      WebFingerAccountManager._instance = new WebFingerAccountManager()
    }
    const self = WebFingerAccountManager._instance
    return self
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

