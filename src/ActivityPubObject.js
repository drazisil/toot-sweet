

/**
 * @class {Object} ActivityPubObject
 * @property {string} context - Mapped externally as "@context"
 * @property {string} id
 * @property {string} type
 */
export class ActivityPubObject {
  '@context' = "https://www.w3.org/ns/activitystreams";
  /** @type {string} */
  id;
  /** @type {string} */
  type;

  /**
   * @construct
   * @param {object} param0
   * @param {string} param0.id
   * @param {string} param0.type
   */
  constructor({id, type}) {
    this.id = id;
    this.type = type;
  }
}
