import { Hono } from "hono"
import { hc } from "hono/client"
import { describe, expect, it } from "vitest"

import { ApiError, send } from "./api-client"

const route = new Hono().get("/thing", (c) => c.json([1], 200))

const request = (fetch: typeof globalThis.fetch) =>
  send(hc<typeof route>("http://test", { fetch }).thing.$get())

const respond = (response: Response) => () => Promise.resolve(response)

describe("send", () => {
  it("returns the data of a successful response", async () => {
    await expect(request(respond(Response.json([1])))).resolves.toEqual([1])
  })

  it("turns an API failure into an ApiError", async () => {
    const body = {
      error: {
        code: "invalid_request",
        message: "Invalid request",
        fieldErrors: { q: ["Required"] },
      },
    }

    const failure = request(respond(Response.json(body, { status: 400 })))

    await expect(failure).rejects.toBeInstanceOf(ApiError)
    await expect(failure).rejects.toMatchObject({
      status: 400,
      code: "invalid_request",
      message: "Invalid request",
      fieldErrors: { q: ["Required"] },
    })
  })

  it("names the status when the body did not come from the API", async () => {
    const html = new Response("<html>bad gateway</html>", {
      status: 502,
      headers: { "content-type": "text/html" },
    })

    await expect(request(respond(html))).rejects.toMatchObject({
      status: 502,
      code: "unknown",
      message: "Request failed with 502",
    })
  })

  it("leaves a network failure as it is", async () => {
    const offline = () => Promise.reject(new TypeError("Failed to fetch"))

    await expect(request(offline)).rejects.toBeInstanceOf(TypeError)
  })
})
