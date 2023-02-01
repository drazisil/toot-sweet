/**
 * @typedef {string | undefined} OptionalString
 */

export class ActivityStreamObject {
  /** @type {string | string[]} */
  "@context" = ["https://www.w3.org/ns/activitystreams"];
  /** @type {string} */
  id = "";
  /** @type {string} */
  type = "";

  /** @type {string=}*/
  attachment = undefined

  /** @type {string=} */
  attributedTo = undefined

  /** @type {string=} */
  audience = undefined

  /** @type {string=} */
  content = undefined

  /** @type {string=} */
  name = ""

  /** @type {string=} */
  endTime = undefined

  /** @type {string=} */
  generator = undefined

  /** @type {string=} */
  icon = undefined

  /** @type {string=} */
  image = undefined

  /** @type {string=} */
  inReplyTo = undefined

  /** @type {string=} */
  location = undefined

  /** @type {string=} */
  preview = undefined

  /** @type {string=} */
  publshed = undefined

  /** @type {string=} */
  replies = undefined

  /** @type {string=} */
  startTime = undefined

  /** @type {string=} */
  summary = undefined

  /** @type {string=} */
  tag = undefined

  /** @type {string=} */
  updated = undefined

  /** @type {string=} */
  url = undefined

  /** @type {string=} */
  to = undefined

  /** @type {string=} */
  bto = undefined

  /** @type {string=} */
  cc = undefined

  /** @type {string=} */
  bcc = undefined

  /** @type {string=} */
  mediaType = undefined

  /** @type {string=} */
  duration = undefined
}
