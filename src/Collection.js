import { ActivityStreamObject } from "./ActivityStreamObject.js";

export class Collection extends ActivityStreamObject {
  /** @type {ActivityStreamObject[]} */
  items = []

  constructor() {
    super()
  }

  toString() {
    return JSON.stringify({
      "@context": this["@context"],
      "type": "Collection",
      "id": this.id,
      "items": this.items
    })
  }
}
