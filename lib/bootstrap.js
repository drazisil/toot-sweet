import { readFileSync } from "node:fs";

/**
 * @global
 * @typedef {object} InitialState
 * @property {string} certificate
 * @property {string} privateKey
 */

/**
 * Create initial state
 * @returns {Promise<InitialState>}
 */
export async function bootStrap() {
  try {
    await import("node:tls");
  } catch (err) {
    throw new Error(`tls support is disabled! ${String(err)}`);
  }

  /** @type {string} */
  let cert;

  try {
    cert = readFileSync("data/dev-crt.pem", { encoding: "utf8" });
  } catch (error) {
    throw new Error(`Unable to read certificate file: ${String(error)}`);
  }

  /** @type {string} */
  let key;

  try {
    key = readFileSync("data/dev-key.pem", { encoding: "utf8" });
  } catch (error) {
    throw new Error(`Unable to read certificate file: %{String(error)}`);
  }

  return {
    certificate: cert,
    privateKey: key,
  };
}
