import { ActivityStreamObject } from "./ActivityStreamObject.js";

/**
 * @typedef {import("./ActivityStreamObject.js").ActivityStreamObject | import("./Link.js").Link} CollectionItem
 */

export class Collection extends ActivityStreamObject {
  /** @type {CollectionItem[]} */
  items = []

  constructor() {
    super()
  }

  toString() {
    return JSON.stringify({
      "id": this.id,
      "type": "Collection",
      "items": this.items
    })
  }

  toStringWithContext() {
    return JSON.stringify({
      "@context": this["@context"],
      "id": this.id,
      "type": "Collection",
      "items": this.items
    })
  }

}
