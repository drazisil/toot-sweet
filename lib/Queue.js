export class Queue {
  /** @type {Queue} */
  static _instance;

  /** @type {Record<string, string>[]} */
  items = [];

  static getQueue() {
    if (!Queue._instance) {
      Queue._instance = new Queue();
    }
    const self = Queue._instance;
    return self;
  }

  /**
   *
   * @param {Record<string, string>} newItem
   */
  add(newItem) {
    this.items.push(newItem);
  }

  /**
   *
   * @returns {Record<string, string>[]}
   */
  getAll() {
    return this.items;
  }
}
