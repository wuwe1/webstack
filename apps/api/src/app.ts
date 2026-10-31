import { Hono } from "hono"

import { handleError, handleNotFound } from "./lib/errors.ts"
import { itemsRoute } from "./routes/items.ts"

export const app = new Hono()
  .route("/api/items", itemsRoute)
  .onError(handleError)
  .notFound(handleNotFound)

export type AppType = typeof app
export type { ApiErrorBody } from "./lib/errors.ts"
