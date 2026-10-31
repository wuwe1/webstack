import { describe, expect, it } from "vitest"

import { parseEnv } from "./env.ts"

describe("parseEnv", () => {
  it("defaults the port", () => {
    expect(parseEnv({}).PORT).toBe(8787)
  })

  it("reads the port as a number", () => {
    expect(parseEnv({ PORT: "3000" }).PORT).toBe(3000)
  })

  it.each(["abc", "0", "70000", "1.5"])("rejects the port %s", (PORT) => {
    expect(() => parseEnv({ PORT })).toThrow()
  })
})
