import { execFileSync, spawnSync } from "node:child_process"
import {
  copyFileSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"
import process from "node:process"

import { afterAll, beforeAll, describe, expect, it } from "vitest"

const ROOT = path.resolve(import.meta.dirname, "../../..")
const CLI = path.join(import.meta.dirname, "cli.js")
const ALPHANUMERIC =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
const BASE32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"

/** Reads the flags from the hook, so the test fails if the hook stops scanning. */
const HOOK = /tooling\/secret-scan\/src\/cli\.js (?<flags>.+)/.exec(
  readFileSync(path.join(ROOT, "lefthook.yml"), "utf8"),
)
const FLAGS = HOOK.groups.flags.trim().split(" ")

function random(length, alphabet = ALPHANUMERIC) {
  return Array.from(
    { length },
    () => alphabet[Math.floor(Math.random() * alphabet.length)],
  ).join("")
}

// Assembled at run time so that this file never trips the scanner itself.
const LEAKS = {
  ".env": "PORT=3000",
  "anthropic.ts": `sk-${"ant"}-api03-${random(93)}AA`,
  "aws.ts": `${"AK"}IA${random(16, BASE32)}`,
  "db.ts": `postgres${"://"}admin:${random(20)}@db.invalid:5432/app`,
  "github.ts": `gh${"p"}_${random(36)}`,
  "stripe.ts": `sk_${"live"}_${random(24)}`,
}

describe("secret-scan", () => {
  let repo

  const git = (...args) =>
    execFileSync("git", args, { cwd: repo, stdio: "pipe" })

  function scan(file, content) {
    writeFileSync(path.join(repo, file), `${content}\n`)
    git("add", "-f", file)
    const { status } = spawnSync(process.execPath, [CLI, ...FLAGS], {
      cwd: repo,
      stdio: "pipe",
    })
    git("rm", "-qf", "--cached", file)
    rmSync(path.join(repo, file))
    return status
  }

  beforeAll(() => {
    execFileSync(process.execPath, [CLI, "version"], { stdio: "pipe" })
    repo = mkdtempSync(path.join(tmpdir(), "secret-scan-"))
    git("init", "-q")
    copyFileSync(
      path.join(ROOT, ".gitleaks.toml"),
      path.join(repo, ".gitleaks.toml"),
    )
  }, 300_000)

  afterAll(() => {
    rmSync(repo, { force: true, recursive: true })
  })

  it.each(Object.entries(LEAKS))("refuses %s", (file, secret) => {
    expect(scan(file, `export const value = "${secret}"`)).toBe(1)
  })

  it("ignores an inline gitleaks:allow", () => {
    const content = `export const value = "${LEAKS["stripe.ts"]}" // gitleaks:allow`
    expect(scan("inline.ts", content)).toBe(1)
  })

  it("allows placeholders in .env.example", () => {
    const content = `DATABASE_URL=postgres${"://"}postgres:postgres@localhost/app`
    expect(scan(".env.example", content)).toBe(0)
  })

  it("allows clean code", () => {
    expect(scan("clean.ts", "export const value = 1")).toBe(0)
  })
})
