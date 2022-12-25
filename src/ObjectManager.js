import { ActivityPubObject } from "./ActivityPubObject.js";
import { Collection } from "./Collection.js";

export class ObjectManager {
  /**
   * @private
   * @static
   * @type {ObjectManager | undefined}
   */
  static _instance;
  /** @type {ActivityPubObject[]} */
  _objects = [];

  /**
   * Add a new object
   * @param {ActivityPubObject} newObject
   */
  add(newObject) {
    this._objects.push(newObject);
  }

  /**
   * Find an object by id
   * @param {string} id
   * @returns {ActivityPubObject | undefined}
   */
  find(id) {
    return this._objects.find(collection => {
      collection.id === id;
    });
  }

  /**
   * List all objects
   * @returns {ActivityPubObject[]}
   */
  list() {
    return this._objects;
  }

  /**
   *
   * @param {string} id
   * @param {ActivityPubObject} updatedObject
   * @throws {Error} - Collection not found
   */
  update(id, updatedObject) {
    const index = this._objects.findIndex(collection => {
      collection.id === id;
    });
    if (index < 0) {
      throw new Error('Collection not found');
    }
    this._objects[index] = updatedObject;
  }

  /**
   * Remove a collection by id
   * @param {string} id
   */
  remove(id) {
    const updatedObjectList = this._objects.filter(collection => {
      collection.id !== id;
    });
    this._objects = updatedObjectList;
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
   * @returns {ObjectManager}
   */
  static getObjectManager() {
    if (typeof ObjectManager._instance === "undefined") {
      ObjectManager._instance = new ObjectManager(true)
    }
    return ObjectManager._instance
  }
}
