import { readFileSync } from "node:fs"
import process from "node:process"
import { parseArgs } from "node:util"

import { lintCommitMessage } from "./lint.js"

const { positionals, values } = parseArgs({
  allowPositionals: true,
  options: { "chinese-body": { type: "boolean", default: false } },
})
const [file] = positionals
if (!file) {
  console.error("Usage: cli.js [--chinese-body] <commit message file>")
  process.exit(2)
}

const errors = lintCommitMessage(readFileSync(file, "utf8"), {
  chineseBody: values["chinese-body"],
})
for (const error of errors) console.error(`✖ ${error}`)
if (errors.length > 0) process.exitCode = 1
