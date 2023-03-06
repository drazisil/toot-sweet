import { describe, expect, it } from "vitest";
import { splitUrl } from "./urls.js";

describe("splitUrl()", () => {
  it("should return / when passed an empty string", () => {
    expect(splitUrl("")[0]).eq("/")
  })

  it("should split a string on the forward slash", () => {
    expect(splitUrl("/one/two/three")[2]).eq("/two")
  })
})
