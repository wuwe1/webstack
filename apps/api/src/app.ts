import { Hono } from "hono"

import { itemsRoute } from "./routes/items.ts"

export const app = new Hono().route("/api/items", itemsRoute)

export type AppType = typeof app
