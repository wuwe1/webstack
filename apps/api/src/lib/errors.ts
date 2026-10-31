import type { ErrorHandler, NotFoundHandler } from "hono"
import { HTTPException } from "hono/http-exception"

export const handleError: ErrorHandler = (error, c) => {
  if (error instanceof HTTPException) return error.getResponse()
  console.error(error)
  return c.json({ error: "Internal server error" }, 500)
}

export const handleNotFound: NotFoundHandler = (c) =>
  c.json({ error: "Not found" }, 404)
