import { describe, expect, it } from "vitest"

import { findHookBypass } from "./guard-bash.js"

describe("findHookBypass", () => {
  it.each([
    ["git commit --no-verify -m x", "--no-verify"],
    ["git push --no-verify", "--no-verify"],
    ["cd web && git push origin main --no-verify", "--no-verify"],
    ["git commit -n -m x", "git commit -n"],
    ["git commit -nm x", "git commit -n"],
    ["git commit -am x -n", "git commit -n"],
    ["git -c core.hooksPath=/dev/null commit -m x", "core.hooksPath"],
    ["git config core.hooksPath /tmp", "core.hooksPath"],
    ["LEFTHOOK=0 git commit -m x", "LEFTHOOK"],
    ["LEFTHOOK=false git commit -m x", "LEFTHOOK"],
    ["$env:LEFTHOOK = 0; git push", "LEFTHOOK"],
    ["$env:lefthook = 0; git push", "LEFTHOOK"],
    ["export LEFTHOOK=0 && git push", "LEFTHOOK"],
    ["LEFTHOOK_EXCLUDE=secrets git commit -m x", "LEFTHOOK"],
    ["$env:LEFTHOOK_EXCLUDE='secrets'; git commit -m x", "LEFTHOOK"],
    ["LEFTHOOK_CONFIG=empty.yml git commit -m x", "LEFTHOOK"],
    ["LEFTHOOK_BIN=true git commit -m x", "LEFTHOOK"],
  ])("reports %s", (command, bypass) => {
    expect(findHookBypass(command)).toBe(bypass)
  })

  it.each([
    "git status",
    "git log -n 5",
    "git log -n 5 && git commit -m x",
    "git push -n",
    'git commit -m "explain --no-verify and -n"',
    "git commit -m '-n'",
    "grep --no-verify README.md",
    "echo LEFTHOOK=0",
    "LEFTHOOK_VERBOSE=1 git push",
  ])("allows %s", (command) => {
    expect(findHookBypass(command)).toBeUndefined()
  })
})
