import { hostname } from "node:os";

const log = (function () {
  /**
   * @param {'info' | 'error'} level
   * @param {object} msg
   * @returns {string}
   */

  const formatMsg = (level, msg) => {
    return `{"level": "${level}", "timestamp": ${new Date().toISOString()}, "hostname": "${hostname}", "message": ${JSON.stringify(
      msg
    )}`;
  };

  return {
    /**
     * @param {object} msg
     */
    info: (msg) => {
      console.log(formatMsg("info", msg));
    },
    /**
     * @param {object} msg
     */
    error: (msg) => {
      console.error(formatMsg("error", msg));
    },
  };
})();

export default log;
