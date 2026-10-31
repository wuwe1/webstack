import { spawnSync } from "node:child_process"
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import path from "node:path"
import process from "node:process"

const ROOT =
  process.env.CLAUDE_PROJECT_DIR ??
  path.resolve(import.meta.dirname, "../../..")
const CACHE = path.join(ROOT, "node_modules/.cache/agent-hooks")
const STATE = path.join(CACHE, "state.json")
const OUTPUT_LINES = 40

function git(args, env) {
  const options = { cwd: ROOT, encoding: "utf8", env }
  return spawnSync("git", args, options).stdout.trim()
}

/** Hashes the working tree, untracked files included, through a scratch index. */
function hashWorkingTree() {
  mkdirSync(CACHE, { recursive: true })
  const index = path.join(CACHE, "index")
  const env = { ...process.env, GIT_INDEX_FILE: index }
  git(["add", "--all"], env)
  const tree = git(["write-tree"], env)
  rmSync(index, { force: true })
  return tree
}

function readState() {
  try {
    return JSON.parse(readFileSync(STATE, "utf8"))
  } catch {
    return {}
  }
}

const { stop_hook_active: retrying } = JSON.parse(
  readFileSync(0, "utf8") || "{}",
)
const tree = hashWorkingTree()
const state = readState()

if (tree === git(["rev-parse", "HEAD^{tree}"]) || tree === state.passed) {
  // Nothing changed since the last commit or the last passing run.
} else if (retrying && tree === state.failed) {
  // Blocking again without new edits would loop forever.
  const systemMessage = "pnpm check still fails and nothing changed."
  process.stdout.write(JSON.stringify({ systemMessage }))
} else {
  const check = spawnSync("pnpm check", {
    cwd: ROOT,
    encoding: "utf8",
    shell: true,
  })
  if (check.status === 0) {
    writeFileSync(STATE, JSON.stringify({ passed: tree }))
  } else {
    writeFileSync(STATE, JSON.stringify({ failed: tree }))
    const output = `${check.stdout}\n${check.stderr}`.trim()
    console.error("pnpm check failed. Fix it before finishing:\n")
    console.error(output.split("\n").slice(-OUTPUT_LINES).join("\n"))
    process.exitCode = 2
  }
}
