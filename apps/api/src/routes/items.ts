import { sValidator } from "@hono/standard-validator"
import { Hono } from "hono"

import { findItems, itemQuerySchema } from "../features/items/items.ts"

export const itemsRoute = new Hono().get(
  "/",
  sValidator("query", itemQuerySchema),
  (c) => c.json(findItems(c.req.valid("query").q)),
)
