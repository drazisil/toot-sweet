import { ActivityPubObject } from './ActivityPubObject.js';

/**
 * @class Application
 * @extends {ActivityPubObject}
 * @property {Object} publicKey
 * @property {string} publicKey.publicKeyPem
 */
export class Application extends ActivityPubObject {
  publicKey = {
    publicKeyPem: ''
  };

  /**
   *
   * @param {Object} param0 
   * @param {string} param0.id
   * @param {object} param0.publicKey
   * @param {string} param0.publicKey.publicKeyPem
   */
  constructor ({id, publicKey}) {
    super({id, type:'Application'})
    this.publicKey = publicKey
  }
}
