import { readFileSync } from "node:fs"
import process from "node:process"

import { findHookBypass } from "./guard-bash.js"

const { tool_input: input } = JSON.parse(readFileSync(0, "utf8"))
const bypass = findHookBypass(input?.command ?? "")
if (bypass) {
  console.error(`Do not skip the git hooks (${bypass}). Fix what they report.`)
  process.exitCode = 2
}
