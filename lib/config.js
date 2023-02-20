import { envSchema } from "env-schema";
import fs from "node:fs";

/**
 * @export
 * @typedef {object} Env
 * @property {string} SITE_HOST
 * @property {'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' } DATABASE_DIALECT
 * @property {string} DATABASE_URI
 * @property {string[]} BLOCKLIST
 * @property {string} LOCAL_HOSTS
 */

const schema = {
  type: "object",
  required: ["SITE_HOST", "DATABASE_DIALECT", "DATABASE_URI"],
  properties: {
    SITE_HOST: {
      type: "string",
    },
    DATABASE_DIALECT: {
      type: "string",
    },
    DATABASE_URL: {
      type: "string",
    },
  },
};

const packagejson = JSON.parse(fs.readFileSync("package.json", "utf8"));

const blocklistjson = JSON.parse(fs.readFileSync("blocklist.json", "utf8"));

const localhostsjson = JSON.parse(fs.readFileSync("localhosts.json", "utf8"));

/** @type {import('ajv').JSONSchemaType<Env>} */
const config = envSchema({
  schema: schema,
  dotenv: true, // load .env if it is there, default: false
});

config["BLOCKLIST"] = blocklistjson;
config["LOCAL_HOSTS"] = localhostsjson;
config["VERSION"] = packagejson["version"];

export default config;
