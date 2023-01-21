import * as assert from "node:assert";
import { describe, it } from "node:test";
import { splitUrl } from "../src/urls.js";

describe("splitUrl()", () => {
  it("should return / when passed an empty string", () => {
    assert.equal(splitUrl(""), "/")
  })

  it("should split a string on the forward slash", () => {
    assert.equal(splitUrl("/one/two/three")[2], "/two")
  })
})
