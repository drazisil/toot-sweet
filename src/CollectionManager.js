import { Collection } from "./Collection.js";

export class CollectionManager {
  /**
   * @private
   * @static
   * @type {CollectionManager | undefined}
   */
  static _instance;
  /** @type {Collection[]} */
  collections = [];

  /**
   * Add a new collection
   * @param {Collection} newConnection
   */
  add(newConnection) {
    this.collections.push(newConnection);
  }

  /**
   * Find a connection by id
   * @param {string} id
   * @returns {Collection | undefined}
   */
  find(id) {
    return this.collections.find(collection => {
      collection.id === id;
    });
  }

  /**
   * List all collections
   * @returns {Collection[]}
   */
  list() {
    return this.collections;
  }

  /**
   *
   * @param {string} id
   * @param {Collection} updatedCollection
   * @throws {Error} - Collection not found
   */
  update(id, updatedCollection) {
    const index = this.collections.findIndex(collection => {
      collection.id === id;
    });
    if (index < 0) {
      throw new Error('Collection not found');
    }
    this.collections[index] = updatedCollection;
  }

  /**
   * Remove a collection by id
   * @param {string} id
   */
  remove(id) {
    const updatedCollections = this.collections.filter(collection => {
      collection.id !== id;
    });
    this.collections = updatedCollections;
  }

  /**
   * @private
   * @param {boolean} self 
   */
  constructor(self) {
    if (self !== true) {
      throw new Error('Please use the static method, getCollectionManager()')
    }
  }

  /**
   * Get the single instance of the collection manager
   * @returns {CollectionManager}
   */
  static getCollectionManager() {
    if (typeof CollectionManager._instance === "undefined") {
      CollectionManager._instance = new CollectionManager(true)
    }
    return CollectionManager._instance
  }
}
