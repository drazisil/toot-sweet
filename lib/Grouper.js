export class Grouper {
  /** @type {Grouper} */
  static _instance

  /** @type {Record<string, (import("./ActivityStreamObject.js").ActivityStreamObject | import("./Link.js").Link | string)[]>} */
  _groups = {}

  static getGrouper() {
    if (!Grouper._instance) {
      Grouper._instance = new Grouper()
    }
    return Grouper._instance
  }

  /**
   *
   * @param {string} groupName
   */
  createGroup(groupName) {
    if (typeof this._groups[groupName] !== "undefined") {
      throw new Error(JSON.stringify({"reason": "Group already exists", groupName}))
    }
    this._groups[groupName] = []
  }


  /**
   *
   * @param {string} groupName
   * @param {import("./ActivityStreamObject.js").ActivityStreamObject | string} item
   */
  addToGroup(groupName, item) {
    if (typeof this._groups[groupName] === "undefined") {
      throw new Error(JSON.stringify({"reason": "No such group", groupName}))
    }
    this._groups[groupName].push(item)
  }

    /**
   *
   * @returns {Record<string, (import("./ActivityStreamObject.js").ActivityStreamObject | import("./Link.js").Link | string)[]>}
   */
    getAll() {
      return this._groups
    }
}
