import { ActivityStreamObject } from "./ActivityStreamObject.js";

/**
 * @typedef {import("./ActivityStreamObject.js").ActivityStreamObject | import("./Link.js").Link | string} CollectionItem
 */

export class Collection extends ActivityStreamObject {
  /** @type {CollectionItem[]} */
  items = [];

  constructor() {
    super();
  }

  toString() {
    return JSON.stringify({
      id: this.id,
      type: "Collection",
      items: this.items,
    });
  }

  toStringWithContext() {
    return JSON.stringify({
      "@context": this.context,
      id: this.id,
      type: "Collection",
      items: this.items,
    });
  }

  get length() {
    return this.items.length;
  }

  /**
   *
   *
   * @author Drazi Crendraven
   * @param {CollectionItem} item
   * @memberof Collection
   */
  push(item) {
    this.items.push(item);
  }

  /**
   *
   *
   * @author Drazi Crendraven
   * @param {string} id
   * @return {CollectionItem | undefined}
   * @memberof Collection
   */
  findId(id) {
    return this.items.find((item) => {
      if (typeof item === "string") {
        return item === id;
      }
      return item.id == id;
    });
  }
}
