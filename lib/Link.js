export class Link  {
  /** @type {string | string[]} */
  "@context" = ["https://www.w3.org/ns/activitystreams"];

  /** @type {string} */
  type = "Link"
  
  /** @type {string} */
  id = "";
  /** @type {string} */

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
    this.name = name
    this.href = href
  }

  toString() {
    return JSON.stringify({
      "@context": this["@context"],
      "type": this.type,
      "id": this.id,
      "href": this.href,
      "hreflang": this.hreflang,
      "mediaType": this.mediaType,
      "name": this.name
    })
  }
}
