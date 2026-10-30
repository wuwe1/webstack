import { zValidator } from "@hono/zod-validator";
import { itemQuerySchema } from "@webstack/shared";
import { Hono } from "hono";

import { findItems } from "../features/items/items";

export const itemsRoute = new Hono().get("/", zValidator("query", itemQuerySchema), (c) =>
  c.json(findItems(c.req.valid("query").q)),
);
