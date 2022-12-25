

/**
 * @typedef {Object} ActivityPubLink
*/

import { ActivityPubObject } from "./ActivityPubObject.js";

/**
 * @class Collection
 * @extends {ActivityPubObject}
 * @property {number} totalItems
 * @property {CollectionPage | ActivityPubLink} current
 * @property {CollectionPage | ActivityPubLink} first
 * @property {CollectionPage | ActivityPubLink} last
 * @property {ActivityPubObject | ActivityPubLink | ActivityPubObject[] | ActivityPubLink[]} items
*/

export class Collection extends ActivityPubObject {
  number = 0;
  /** @type {CollectionPage | ActivityPubLink | undefined} */
  first;
  /** @type {CollectionPage | ActivityPubLink | undefined} */
  last;
  /** @type {ActivityPubObject | ActivityPubLink | ActivityPubObject[] | ActivityPubLink[]} */
  items = [];

  /**
   *
   * @param {string} id
   */
  constructor(id) {
    super({id, type: 'Collection'});
  }
}

/**
 * @class CollectionPage
 * @extends {Collection}
 * @property {Link | Collection} partOf
 * @property {CollectionPage | ActivityPubLink} next
 * @property {CollectionPage | ActivityPubLink} prev
 */
export class CollectionPage extends Collection {
  /** @type {ActivityPubLink | Collection | undefined} */
  partOf
  /** @type {CollectionPage | ActivityPubLink | undefined} */
  next
  /** @type {CollectionPage | ActivityPubLink | undefined} */
  prev
}