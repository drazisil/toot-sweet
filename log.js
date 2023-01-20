import { hostname } from "node:os"
import { inspect } from "node:util"

const log = function() {
    /** 
     * @param {'info' | 'error'} level
     * @param {object} msg
     * @returns {string}
     */

    const formatMsg = (level, msg) => {        
        return `{"level": "${level}", "hostname": "${hostname}", "message": ${inspect(msg)}`
    }

    return {
    /** 
     * @param {object} msg
     */
    info: (msg) => {
      console.log(formatMsg('info', msg))
    }, 
    /** 
     * @param {object} msg
     */
    error: (msg) => {
        console.error(formatMsg('error', msg))
      }
    }
  }()

export default log