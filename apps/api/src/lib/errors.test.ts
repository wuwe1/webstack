import { Hono } from "hono"
import { HTTPException } from "hono/http-exception"
import { afterEach, describe, expect, it, vi } from "vitest"

import { handleError, handleNotFound } from "./errors.ts"

const app = new Hono()
  .get("/crash", () => {
    throw new Error("database password")
  })
  .get("/teapot", () => {
    throw new HTTPException(418, { message: "short and stout" })
  })
  .onError(handleError)
  .notFound(handleNotFound)

afterEach(() => {
  vi.restoreAllMocks()
})

describe("error handlers", () => {
  it("hides the cause of an unexpected error", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {})

    const response = await app.request("/crash")

    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({ error: "Internal server error" })
    expect(log).toHaveBeenCalledOnce()
  })

  it("keeps the status of an intended error", async () => {
    const response = await app.request("/teapot")

    expect(response.status).toBe(418)
    expect(await response.text()).toBe("short and stout")
  })

  it("answers unknown paths with JSON", async () => {
    const response = await app.request("/missing")

    expect(response.status).toBe(404)
    expect(await response.json()).toEqual({ error: "Not found" })
  })
})
