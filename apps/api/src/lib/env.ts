import * as v from "valibot"

const envSchema = v.object({
  PORT: v.optional(
    v.pipe(
      v.string(),
      v.toNumber(),
      v.integer(),
      v.minValue(1),
      v.maxValue(65_535),
    ),
    "8787",
  ),
})

/** Throws at startup, so a bad setting cannot surface during a request. */
export function parseEnv(source: Record<string, string | undefined>) {
  return v.parse(envSchema, source)
}
