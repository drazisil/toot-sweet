import { ActivityPubObject } from './ActivityPubObject.js';

/**
 * @class Actor
 * @extends {ActivityPubObject}
 * @property {Object} param0
 * @property {string} param0.id
 */
export class Actor extends ActivityPubObject {

  /**
   *
   * @param {Object} param0
   * @param {string} param0.id
   */
  constructor({ id }) {
    super({id, type: 'Actor'});
  }
}
