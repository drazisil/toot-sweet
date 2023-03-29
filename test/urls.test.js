import { equal } from "node:assert/strict";
import { describe, it } from "node:test";
import { splitUrl } from "../lib/urls.js";

describe("splitUrl()", () => {
  it("should return / when passed an empty string", () => {
    equal(splitUrl("")[0], "/");
  });

  it("should split a string on the forward slash", () => {
    equal(splitUrl("/one/two/three")[2], "/two");
  });
});
