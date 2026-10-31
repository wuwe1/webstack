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
  .get("/locked", () => {
    throw new HTTPException(401, {
      res: new Response(null, { headers: { "WWW-Authenticate": "Bearer" } }),
    })
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
    expect(await response.json()).toEqual({
      error: { code: "internal_error", message: "Internal server error" },
    })
    expect(log).toHaveBeenCalledOnce()
  })

  it("keeps the status of an intended error", async () => {
    const response = await app.request("/teapot")

    expect(response.status).toBe(418)
    expect(await response.json()).toEqual({
      error: { code: "http_418", message: "short and stout" },
    })
  })

  it("keeps the headers of an intended error", async () => {
    const response = await app.request("/locked")

    expect(response.status).toBe(401)
    expect(response.headers.get("WWW-Authenticate")).toBe("Bearer")
    expect(await response.json()).toEqual({
      error: { code: "http_401", message: "Request failed" },
    })
  })

  it("answers unknown paths with JSON", async () => {
    const response = await app.request("/missing")

    expect(response.status).toBe(404)
    expect(await response.json()).toEqual({
      error: { code: "not_found", message: "Not found" },
    })
  })
})
