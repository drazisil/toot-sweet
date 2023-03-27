import { envSchema } from "env-schema";
import { readFileSync } from "node:fs";

/**
 * @export
 * @global
 * @typedef {object} Env
 * @property {string} siteHost
 * @property {string[]} blockList
 * @property {string[]} localHosts
 * @property {string} version
 */

const schema = {
  type: "object",
  required: ["SITE_HOST"],
  properties: {
    SITE_HOST: {
      type: "string",
    },
  },
};

class AppConfiguration {
  /**
   * @type {AppConfiguration}
   */
  static _instance;

  /** @type {import('ajv').JSONSchemaType<Env>} */
  #config

  constructor() {
    try {
      this.#config = envSchema({
        schema,
      });

      this.#config["BLOCKLIST"] = JSON.parse(readFileSync("blocklist.json", "utf8"));
      this.#config["LOCAL_HOSTS"] = JSON.parse(readFileSync("localhosts.json", "utf8"));
      this.#config["VERSION"] = JSON.parse(readFileSync("package.json", "utf8"))["version"];
    } catch (error) {
      throw new Error(
        `Error reading JSON configuration files: ${String(error)}`
      );
    }
  }

  
  /**
   *
   *
   * @author Drazi Crendraven
   * @readonly
   * @returns {Env}
   * @memberof AppConfiguration
   */
  get config() {
    return {
      siteHost: this.#config["SITE_HOST"],
      blockList: this.#config["BLOCKLIST"],
      localHosts: this.#config["LOCAL_HOSTS"],
      version: this.#config["VERSION"]
    }
  }
}

/**
 *
 * Load the configuration from the environment
 * @author Drazi Crendraven
 * @returns {Env}
 */
export function loadConfiguration() {
  try {

    if (typeof AppConfiguration._instance === "undefined") {
      AppConfiguration._instance = new AppConfiguration()
    }

    return AppConfiguration._instance.config;
  } catch (error) {
    throw new Error(`Error reading config: ${String(error)}`);
  }
}
