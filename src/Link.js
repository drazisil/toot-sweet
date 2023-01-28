import { ActivityStreamObject } from "./ActivityStreamObject.js";

export class Link extends ActivityStreamObject {
  href = ""

  hreflang = "en"

  mediaType = "text/html"

  name = ""

  /**
   *
   * @param {string} name
   * @param {string} href
   */
  constructor(name, href) {
    super()
    this.name = name
    this.href = href
  }

  toString() {
    return JSON.stringify({
      "@context": this["@context"],
      "type": "Link",
      "id": this.id,
      "href": this.href,
      "hreflang": this.hreflang,
      "mediaType": this.mediaType,
      "name": this.name
    })
  }
}
