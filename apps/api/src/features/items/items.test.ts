import { describe, expect, it } from "vitest"

import { findItems } from "./items"

describe("findItems", () => {
  it("returns every item without a query", () => {
    expect(findItems()).toHaveLength(3)
  })

  it("matches names regardless of case", () => {
    expect(findItems("KEY").map((item) => item.name)).toEqual(["Keyboard"])
  })
})
