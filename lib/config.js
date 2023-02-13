import { envSchema } from 'env-schema'

/** 
 * @typedef {object} Env
 * @property {'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' } DATABASE_DIALECT
 */

const schema = {
    type: 'object',
    required: ["DATABASE_DIALECT", "DATABASE_URI"],
    properties: {
        DATABASE_DIALECT: {
            type: 'string'
        }
    }
}

/** @type {import('ajv').JSONSchemaType<Env>} */
const config = envSchema({
    schema: schema,
    dotenv: true // load .env if it is there, default: false
})

export default config
