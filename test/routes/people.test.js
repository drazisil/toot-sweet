import { server } from "../../src/mocks/server.js";
import { before, describe, it, afterEach, after } from "node:test";
import { app } from "../../lib/index.js";
import request from "supertest";
import { ok } from "assert/strict";

before(() => {
  server.listen({
    onUnhandledRequest: "error",
  });
});

describe("/people route", () => {

  after(() => {
    server.close();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  it("should return a status code of 404", () => {
    request(app)
      .get("/people")
      .expect(404)
      .end((err) => {
        if (err) {
          throw err;
        }
      });
    ok(true);
  });
});
