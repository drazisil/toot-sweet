export class Queue {
  /** @type {Queue} */
  static _instance

  /** @type {Record<string, string>[]} */
  items = []

  static getQueue() {
    if (typeof Queue._instance === "undefined") {
      Queue._instance = new Queue()
    }
    return Queue._instance
  }

  /**
   *
   * @param {Record<string, string>} newItem
   */
  add(newItem) {
    this.items.push(newItem)
  }

  /**
   *
   * @returns {Record<string, string>[]}
   */
  getAll() {
    return this.items
  }
}
