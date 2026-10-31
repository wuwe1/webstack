import path from "node:path"

import { cruise } from "dependency-cruiser"
import { beforeAll, describe, expect, it } from "vitest"

import config from "../../../.dependency-cruiser.cjs"

const FIXTURES = path.resolve(import.meta.dirname, "../fixtures")
const API = "apps/api/src"
const WEB = "apps/web/src"

/** Every rule needs at least one violation here, or a broken rule goes unseen. */
const EXPECTED = {
  "api-does-not-import-web": [[`${API}/routes/web.ts`, `${WEB}/lib/client.ts`]],
  "apps-and-packages-do-not-import-tooling": [
    [`${WEB}/lib/dev-config.ts`, "tooling/config/src/index.ts"],
    ["packages/contracts/src/checked.ts", "tooling/config/src/index.ts"],
  ],
  "components-stay-generic": [
    [`${WEB}/components/widget.ts`, `${WEB}/features/items/items.ts`],
  ],
  "features-do-not-import-routes": [
    [`${WEB}/features/pages/pages.ts`, `${WEB}/routes/index.ts`],
  ],
  "features-stay-independent": [
    [`${WEB}/features/orders/orders.ts`, `${WEB}/features/items/items.ts`],
  ],
  "no-circular": [[`${API}/features/cycle/a.ts`, `${API}/features/cycle/b.ts`]],
  "no-unresolvable": [[`${API}/features/broken/broken.ts`, "./missing.ts"]],
  "packages-and-tooling-do-not-import-apps": [
    ["packages/other/src/index.ts", `${API}/app.ts`],
    ["tooling/other/src/index.ts", `${API}/app.ts`],
  ],
  "web-imports-only-api-types": [[`${WEB}/lib/server.ts`, `${API}/app.ts`]],
}

/** Allowed imports. The rules must see them and stay silent. */
const ALLOWED = [
  `${API}/features/type-cycle/a.ts`,
  `${API}/routes/items.ts`,
  `${WEB}/features/items/items.ts`,
  `${WEB}/lib/client.ts`,
  `${WEB}/routes/index.ts`,
]

describe("architecture rules", () => {
  let result

  beforeAll(async () => {
    const { output } = await cruise(
      ["apps", "packages", "tooling"],
      {
        baseDir: FIXTURES,
        exclude: config.options.exclude,
        ruleSet: { forbidden: config.forbidden },
        tsPreCompilationDeps: config.options.tsPreCompilationDeps,
        validate: true,
      },
      { extensions: [".ts"] },
    )
    result = output
  }, 60_000)

  it("gives every rule a fixture", () => {
    const rules = config.forbidden.map(({ name }) => name).sort()
    expect(Object.keys(EXPECTED).sort()).toEqual(rules)
  })

  it("reports exactly the expected violations", () => {
    const reported = {}
    for (const { from, rule, to } of result.summary.violations) {
      ;(reported[rule.name] ??= []).push([from, to])
    }
    for (const pairs of Object.values(reported)) pairs.sort()
    expect(reported).toEqual(EXPECTED)
  })

  it.each(ALLOWED)("scans the allowed file %s", (file) => {
    const sources = result.modules.map(({ source }) => source)
    expect(sources).toContain(file)
  })
})
