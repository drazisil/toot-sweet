import { envSchema } from 'env-schema'
import fs from 'node:fs'

/**
 * @typedef {object} Env
 * @property {string} SITE_HOST
 * @property {'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' } DATABASE_DIALECT
 * @property {string} DATABASE_URI
 */

const schema = {
  type: 'object',
  required: ["SITE_HOST", "DATABASE_DIALECT", "DATABASE_URI"],
  properties: {
    SITE_HOST: {
      type: 'string'
    },
    DATABASE_DIALECT: {
      type: 'string'
    },
    DATABASE_URL: {
      type: 'string'
    }
  }
}

const packagejson = JSON.parse(fs.readFileSync('package.json', 'utf8'))


/** @type {import('ajv').JSONSchemaType<Env>} */
const config = envSchema({
  schema: schema,
  dotenv: true // load .env if it is there, default: false
})

config["VERSION"] = packagejson["version"]

export default config
