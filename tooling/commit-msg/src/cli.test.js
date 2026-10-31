import { spawnSync } from "node:child_process"
import { mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"
import process from "node:process"

import { afterAll, beforeAll, describe, expect, it } from "vitest"

const CLI = path.join(import.meta.dirname, "cli.js")

describe("commit-msg cli", () => {
  let directory
  let file

  const run = (...args) =>
    spawnSync(process.execPath, [CLI, ...args], { encoding: "utf8" })

  beforeAll(() => {
    directory = mkdtempSync(path.join(tmpdir(), "commit-msg-"))
    file = path.join(directory, "COMMIT_EDITMSG")
    writeFileSync(file, "feat: add login\n\nAdd a login page.\n")
  })

  afterAll(() => {
    rmSync(directory, { force: true, recursive: true })
  })

  it("accepts an English body by default", () => {
    expect(run(file).status).toBe(0)
  })

  it("requires a Chinese body with the flag", () => {
    const { status, stderr } = run("--chinese-body", file)

    expect(status).toBe(1)
    expect(stderr).toContain("the body must be written in Chinese")
  })

  it("explains itself without a file", () => {
    const { status, stderr } = run()

    expect(status).toBe(2)
    expect(stderr).toContain("Usage")
  })
})
