import { Hono } from "hono"

import {
  findItem,
  findItems,
  itemQuerySchema,
} from "../features/items/items.ts"
import { apiError, validate } from "../lib/errors.ts"

export const itemsRoute = new Hono()
  .get("/", validate("query", itemQuerySchema), (c) =>
    c.json(findItems(c.req.valid("query").q), 200),
  )
  .get("/:id", (c) => {
    const item = findItem(c.req.param("id"))
    if (!item) {
      return c.json(
        apiError({ code: "item_not_found", message: "No such item" }),
        404,
      )
    }
    return c.json(item, 200)
  })
