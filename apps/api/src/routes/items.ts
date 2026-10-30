import { sValidator } from "@hono/standard-validator"
import { itemQuerySchema } from "@webstack/shared"
import { Hono } from "hono"

import { findItems } from "../features/items/items.ts"

export const itemsRoute = new Hono().get(
  "/",
  sValidator("query", itemQuerySchema),
  (c) => c.json(findItems(c.req.valid("query").q)),
)
