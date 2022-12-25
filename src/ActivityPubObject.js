
//#region Classes
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
   * @param {string} id
   * @param {string} type
   */
  constructor(id, type) {
    this.id = id;
    this.type = type;
  }
}
