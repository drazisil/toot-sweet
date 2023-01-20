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
}
