import { errorHandler } from "../lib/middleware/errorHandler.js";
import { strictEqual } from "node:assert/strict";
import { describe, it } from "node:test";

describe("Error Handler Middleware", () => {
  it("should call the end() method of the res object that is passed to it", () => {
    let message = ''
    const res = {
      end: (/** @type {string} */ m) => {
        message = m
      },
      get: () => "Sentry Error ID"
    }
    // @ts-ignore
    errorHandler(new Error("Test Error"), {}, res, {})
    strictEqual(message, "Sentry Error ID\n", "Message is equal to foo")
  })
})
