/**
 * @typedef {import("./ActivityStreamObject.js").ActivityStreamObject | import("./Link.js").Link | string} CollectionItem
 * @typedef {Record<string, Collection>} Collections
 */

import { Collection } from "./Collection.js";

export class Grouper {
  /** @type {Grouper} */
  static _instance;

  /** @type {Collections} */
  _groups = {};

  static getGrouper() {
    if (!Grouper._instance) {
      Grouper._instance = new Grouper();
    }
    return Grouper._instance;
  }

  /**
   *
   * @param {string} groupName
   */
  createGroup(groupName) {
    if (typeof this._groups[groupName] !== "undefined") {
      throw new Error(
        JSON.stringify({ reason: "Group already exists", groupName })
      );
    }
    this._groups[groupName] = new Collection();
  }

  /**
   *
   * @param {string} groupName
   * @param {CollectionItem} item
   */
  addToGroup(groupName, item) {
    if (typeof this._groups[groupName] === "undefined") {
      throw new Error(JSON.stringify({ reason: "No such group", groupName }));
    }
    this._groups[groupName].push(item);
  }

  /**
   *
   *
   * @author Drazi Crendraven
   * @param {string} groupName
   * @returns {Collection}
   * @memberof Grouper
   */
  findGroup(groupName) {
    return this._groups[groupName] ?? new Collection();
  }

  /**
   *
   * @returns {Collections}
   */
  getAll() {
    return this._groups;
  }
}
