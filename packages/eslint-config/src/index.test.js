import { readFileSync } from "node:fs"
import path from "node:path"

import { ESLint } from "eslint"
import { beforeAll, describe, expect, it } from "vitest"

const PACKAGE = path.resolve(import.meta.dirname, "..")
const FIXTURES = path.join(PACKAGE, "fixtures")
const ROOT = path.resolve(PACKAGE, "../..")
const WORKSPACE = path.join(ROOT, "pnpm-workspace.yaml")

const EXPECTATION = /(?:\/\/|\/\*) expect(-next)?: ([^*]*)/

/** Reads `// expect: rule` and `// expect-next: rule` comments as line => rules. */
function expectedRules(source) {
  const expected = {}
  for (const [index, text] of source.split("\n").entries()) {
    const match = EXPECTATION.exec(text)
    if (!match) continue
    const line = index + (match[1] ? 2 : 1)
    expected[line] = match[2].trim().split(/\s+/).sort()
  }
  return expected
}

function reportedRules(messages) {
  const reported = {}
  for (const { line, ruleId, message } of messages) {
    ;(reported[line] ??= new Set()).add(ruleId ?? `fatal: ${message}`)
  }
  return Object.fromEntries(
    Object.entries(reported).map(([line, rules]) => [line, [...rules].sort()]),
  )
}

describe("fixtures", () => {
  let eslint

  beforeAll(() => {
    eslint = new ESLint({ cwd: FIXTURES })
  })

  it.each([
    "type-safety.ts",
    "shared.ts",
    "react.tsx",
    "clean.tsx",
    "routes/page.tsx",
    "unit.test.ts",
    "e2e.spec.ts",
    "common.cjs",
    "tool.config.js",
  ])("reports exactly what %s expects", async (name) => {
    const file = path.join(FIXTURES, name)
    const [result] = await eslint.lintFiles([file])

    expect(reportedRules(result.messages)).toEqual(
      expectedRules(readFileSync(file, "utf8")),
    )
  })
})

describe("pnpm rules", () => {
  let eslint

  beforeAll(() => {
    eslint = new ESLint({ cwd: ROOT })
  })

  const ruleIds = (result) => result.messages.map(({ ruleId }) => ruleId)

  it("requires catalog versions without rewriting the workspace", async () => {
    const before = readFileSync(WORKSPACE, "utf8")

    const [result] = await eslint.lintText(
      JSON.stringify({ name: "x", dependencies: { react: "^19.0.0" } }),
      { filePath: path.join(PACKAGE, "package.json") },
    )

    expect(ruleIds(result)).toContain("pnpm/json-enforce-catalog")
    expect(readFileSync(WORKSPACE, "utf8")).toBe(before)
  })

  it("requires the supply chain settings", async () => {
    const before = readFileSync(WORKSPACE, "utf8")

    const [result] = await eslint.lintText("packages:\n  - apps/*\n", {
      filePath: WORKSPACE,
    })

    expect(ruleIds(result)).toContain("pnpm/yaml-enforce-settings")
    expect(readFileSync(WORKSPACE, "utf8")).toBe(before)
  })
})
