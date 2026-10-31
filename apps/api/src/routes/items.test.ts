import { describe, expect, it } from "vitest"

import { app } from "../app.ts"

describe("items routes", () => {
  it("filters by the query", async () => {
    const response = await app.request("/api/items?q=key")

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual([
      { id: "1", name: "Keyboard", stock: 12 },
    ])
  })

  it("rejects an invalid query with field errors", async () => {
    const response = await app.request("/api/items?q=a&q=b")

    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({
      error: {
        code: "invalid_request",
        message: "Invalid request",
        fieldErrors: {
          q: ["Invalid type: Expected string but received Array"],
        },
      },
    })
  })

  it("returns one item", async () => {
    const response = await app.request("/api/items/1")

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({
      id: "1",
      name: "Keyboard",
      stock: 12,
    })
  })

  it("answers a missing item with its own code", async () => {
    const response = await app.request("/api/items/9")

    expect(response.status).toBe(404)
    expect(await response.json()).toEqual({
      error: { code: "item_not_found", message: "No such item" },
    })
  })
})
