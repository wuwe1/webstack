import { readFileSync } from "node:fs"
import process from "node:process"

import { lintCommitMessage } from "./lint.js"

const [file] = process.argv.slice(2)
if (!file) {
  console.error("Usage: cli.js <commit message file>")
  process.exit(2)
}

const errors = lintCommitMessage(readFileSync(file, "utf8"))
for (const error of errors) console.error(`✖ ${error}`)
if (errors.length > 0) process.exitCode = 1
