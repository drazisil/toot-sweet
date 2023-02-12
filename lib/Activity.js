import { ActivityStreamObject } from "./ActivityStreamObject.js";
import Avj from "ajv"
import log from "./logger.js";

/**
 * @typedef {import("express-serve-static-core").Request} Request
 */

/**
 * @typedef {object} ActivityBody
 * @property {string} id
 * @property {string} type
 * @property {string} actor
 * @property {string} to
 * @property {ActivityStreamObject} object
 * @property { string} signature
 */

const avj = new Avj.default()

export const ActivitySchema = {
  type: "object",
  properties: {
    actor: { type: "string"}
  },
  required: ["actor"]
}

const activityValidate = avj.compile(ActivitySchema)

/**
 *
 *
 * @class Activity
 * @extends {ActivityStreamObject}
 */
class Activity extends ActivityStreamObject {
  actor = ":"

  /** @type {ActivityStreamObject} */
  object = new ActivityStreamObject()

  target = undefined

  result = undefined

  origin = undefined

  instrument = undefined

  // This is an attribute from HTTP Signatures
  signature = ""

  // This is a custom property
  headerHostname = ""

  headerMethod = ""

  headerUrl = ""

  headerSig = ""

  /**
   *
   * @param {Request} request
   */
  static fromRequest(request) {
    /** @type {ActivityBody} */
    const body = request.body

    console.log(body);

    const isValid = activityValidate(body)
    if (!isValid) {
      throw new Error(`Unable to validate body: ${JSON.stringify(activityValidate.errors)}`)
    }

    log.info({"isValue": isValid})

    const newActivity = new Activity()

    newActivity.headerHostname = request.hostname
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
      "headerHostname": this.headerHostname,
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

export { Activity}
