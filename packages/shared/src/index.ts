import * as v from "valibot";

export const itemSchema = v.object({
  id: v.string(),
  name: v.string(),
  stock: v.pipe(v.number(), v.integer(), v.minValue(0)),
});

export type Item = v.InferOutput<typeof itemSchema>;

export const itemListSchema = v.array(itemSchema);

export const itemQuerySchema = v.object({
  q: v.optional(v.pipe(v.string(), v.trim())),
});
