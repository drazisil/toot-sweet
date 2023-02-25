import { envSchema } from "env-schema";
import {readFileSync} from "node:fs";

/**
 * @export
 * @typedef {object} Env
 * @property {string} SITE_HOST
 * @property {string[]} BLOCKLIST
 * @property {string} LOCAL_HOSTS
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

const packagejson = JSON.parse(readFileSync("package.json", "utf8"));

const blocklistjson = JSON.parse(readFileSync("blocklist.json", "utf8"));

const localhostsjson = JSON.parse(readFileSync("localhosts.json", "utf8"));

/** @type {import('ajv').JSONSchemaType<Env>} */
const config = envSchema({
  schema: schema,
  dotenv: true, // load .env if it is there, default: false
});

config["BLOCKLIST"] = blocklistjson;
config["LOCAL_HOSTS"] = localhostsjson;
config["VERSION"] = packagejson["version"];

export default config;
