import { ActivityStreamObject } from "./ActivityStreamObject.js";

export class Collection extends ActivityStreamObject {
  /** @type {ActivityStreamObject[]} */
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
