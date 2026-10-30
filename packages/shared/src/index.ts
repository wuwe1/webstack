import { z } from "zod";

export const itemSchema = z.object({
  id: z.string(),
  name: z.string(),
  stock: z.number().int().nonnegative(),
});

export type Item = z.infer<typeof itemSchema>;

export const itemListSchema = z.array(itemSchema);

export const itemQuerySchema = z.object({
  q: z.string().trim().optional(),
});
