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

  attachment = undefined

  attributedTo = undefined

  audience = undefined

  content = undefined

  name = undefined

  endTime = undefined

  generator = undefined

  icon = undefined

  image = undefined

  inReplyTo = undefined

  location = undefined

  preview = undefined

  publshed = undefined

  replies = undefined

  startTime = undefined

  summary = undefined

  tag = undefined

  updated = undefined

  url = undefined

  to = undefined

  bto = undefined

  cc = undefined

  bcc = undefined

  mediaType = undefined

  duration = undefined
}
