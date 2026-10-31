import { existsSync, readFileSync } from "node:fs"
import path from "node:path"

import { describe, expect, it } from "vitest"

const ROOT = path.resolve(import.meta.dirname, "../../..")
const SCRIPT = /(?:\$CLAUDE_PROJECT_DIR\/|node )([\w./-]+\.js)/g

/** A stale path fails silently: Claude Code ignores a hook that cannot start. */
describe.each([".claude/settings.json", "lefthook.yml"])("%s", (file) => {
  const text = readFileSync(path.join(ROOT, file), "utf8")
  const scripts = [...text.matchAll(SCRIPT)].map((match) => match[1])

  it("names at least one script", () => {
    expect(scripts.length).toBeGreaterThan(0)
  })

  it.each(scripts)("runs %s, which exists", (script) => {
    expect(existsSync(path.join(ROOT, script))).toBe(true)
  })
})
