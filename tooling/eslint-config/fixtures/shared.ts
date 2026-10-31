import { readFileSync } from "fs" // expect: unicorn/prefer-node-protocol
import { tmpdir } from "node:os" // expect: unused-imports/no-unused-imports
import { sep } from "node:path" // expect: import/no-duplicates
import { delimiter, join } from "node:path" // expect: import/no-duplicates
import { pathToFileURL, fileURLToPath } from "node:url" // expect: perfectionist/sort-named-imports
import process from "node:process"

export { delimiter, fileURLToPath, join, pathToFileURL, process, readFileSync, sep }
export const debug = () => console.log("x") // expect: no-console
export const allowed = () => console.error("x")

export const loose = (value: unknown) => value == 1 // expect: eqeqeq
export const nullCheckIsFine = (value: unknown) => value == null

export const includes = [1].indexOf(1) !== -1 // expect: e18e/prefer-includes
export const startsWith = "x".indexOf("x") === 0 // expect: unicorn/prefer-string-starts-ends-with
export const fill = new Array(3) // expect: unicorn/no-new-array

export const digits = /[0-9]/ // expect: regexp/prefer-d
export const dupes = /[aa]/ // expect: regexp/no-dupe-characters-character-class

export const implicitProcess = () => globalThis.process.cwd() // expect: node/prefer-global/process

export const topLevel = await Promise.resolve(1) // expect: antfu/no-top-level-await
