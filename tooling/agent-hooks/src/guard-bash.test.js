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
    ["git commit --no-verif -m x", "--no-verify"],
    ["git commit --no-veri -m x", "--no-verify"],
    ["git push --no-veri", "--no-verify"],
    ['git commit "--no-verify" -m x', "--no-verify"],
    ['git -c "core.hooksPath=/dev/null" commit -m x', "core.hooksPath"],
    ['sh -c "git commit --no-verify -m x"', "--no-verify"],
    ["bash -lc 'git push --no-verify'", "--no-verify"],
    [`pwsh -Command "git commit --no-verify -m 'x'"`, "--no-verify"],
    ['eval "git commit -n -m x"', "git commit -n"],
    ['cmd /c "git push --no-verify"', "--no-verify"],
    ['sh -c "LEFTHOOK=0 git push"', "LEFTHOOK"],
    ["git.exe commit --no-verify -m x", "--no-verify"],
    ["/usr/bin/git push --no-verify", "--no-verify"],
    ['"C:\\Program Files\\Git\\cmd\\git.exe" push --no-verify', "--no-verify"],
    ["lefthook uninstall", "removing hooks"],
    ["pnpm exec lefthook uninstall", "removing hooks"],
    ["rm .git/hooks/pre-commit", "removing hooks"],
    ["rm -rf .git/hooks", "removing hooks"],
    ["Remove-Item .git\\hooks\\pre-push", "removing hooks"],
    ["del .git\\hooks\\pre-commit", "removing hooks"],
    ["mv .git/hooks /tmp/hooks", "removing hooks"],
    // Only mentioning the flag is also refused. That false positive is accepted.
    ['echo "git commit --no-verify"', "--no-verify"],
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
    'git commit -m "explain --no-verif"',
    "git push --no-ver",
    "git commit -am 'x --no-verify'",
    'git commit --message="x --no-verify"',
    "git commit -m 'core.hooksPath'",
    `git commit -m "$(cat <<'EOF'\nfeat: x\n\ngit commit --no-verify is refused\nEOF\n)"`,
    "git commit -m @'\nfeat: explain git commit --no-verify\n'@",
    'git log --grep="--no-verify"',
    "cat .git/hooks/pre-commit",
    "ls .git/hooks",
    "rm notes.txt && ls .git/hooks",
    'echo "LEFTHOOK=0"',
    "pnpm exec lefthook install",
  ])("allows %s", (command) => {
    expect(findHookBypass(command)).toBeUndefined()
  })
})
