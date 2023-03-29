import { PeopleConnector } from "../lib/PeopleConnector.js";
import { describe, it } from "node:test";
import { ok } from "node:assert/strict";

describe("PeopleConnector", () => {
  describe("getPeopleConnector", () => {
    it("is a static method that returns an instance of PeopleConnector", () => {
      // arrange
      const expectedClass = PeopleConnector;

      /** @type {import("../lib/config.js").Env} */
      const testConfig = {
        siteHost: "",
        blockList: [],
        localHosts: [],
        version: "",
      };

      // act
      const testPeopleConnector =
        PeopleConnector.getPeopleConnector(testConfig);

      // assert
      ok(testPeopleConnector instanceof expectedClass === true);
    });
  });
});
