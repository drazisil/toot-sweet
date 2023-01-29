import { ActivityStreamObject } from "./ActivityStreamObject.js";

export class Activity extends ActivityStreamObject {
  actor = undefined

  object = undefined

  target = undefined

  result = undefined

  origin = undefined

  instrument = undefined

  // This is an attribute from HTTP Signatures
  signature = undefined

  // This is a custom property
  headerSig = ""

  headerMethod = ""

  headerUrl = ""

  /**
   *
   * @param {import("express-serve-static-core").Request} request
   */
  static fromRequest(request) {
    const { body } = request
    const newActivity = new Activity()

    newActivity.headerMethod = request.method
    newActivity.headerUrl = request.url
    newActivity.headerSig = request.get("signature") ?? ""
    newActivity.id = body["id"]
    newActivity.type = body["type"]
    newActivity.actor = body["actor"]
    newActivity.to = body["to"]
    newActivity.object = body["object"]
    newActivity.signature = body["signature"]

    return newActivity
  }

  toString() {
    return JSON.stringify({
      "headerMethod": this.headerMethod,
      "headerUrl": this.headerUrl,
      "headerSig": this.headerSig,
      "id": this.id,
      "type": "Link",
      "actor": this.actor,
      "to": this.to,
      "object": this.object,
      "signature": this.signature
    })
  }

  toStringWithContext() {
    return JSON.stringify({
      "headerMethod": this.headerMethod,
      "headerUrl": this.headerUrl,
      "headerSig": this.headerSig,
      "@context": this["@context"],
      "id": this.id,
      "type": "Link",
      "actor": this.actor,
      "to": this.to,
      "object": this.object,
      "signature": this.signature
    })
  }

}
