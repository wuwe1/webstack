import { describe, expect, it } from "vitest"

import { lintCommitMessage } from "./lint.js"

describe("title", () => {
  it.each([
    "feat: add login",
    "fix(api): handle empty input",
    "feat!: drop node 20",
    "refactor(web)!: rename routes",
  ])("accepts %s", (header) => {
    expect(lintCommitMessage(header)).toEqual([])
  })

  it.each([
    ["add login", /type\(scope\): subject/],
    ["feat add login", /type\(scope\): subject/],
    ["feat:add login", /type\(scope\): subject/],
    ["wip: add login", /type must be one of/],
    ["Feat: add login", /type must be one of/],
    ["feat(API): add login", /scope must be lower case/],
    ["feat: ", /type\(scope\): subject/],
    ["feat: Add login", /must not start with a capital/],
    ["feat: add login.", /must not end with a period/],
    [`feat: ${"x".repeat(45)}`, /must fit 50 characters/],
  ])("rejects %s", (header, error) => {
    expect(lintCommitMessage(header).join("\n")).toMatch(error)
  })

  it("accepts a title of exactly 50 characters", () => {
    expect(lintCommitMessage(`feat: ${"x".repeat(44)}`)).toEqual([])
  })
})

describe("body", () => {
  const withBody = (body) => `feat: add login\n\n${body}\n`

  it("accepts a short Chinese body", () => {
    expect(lintCommitMessage(withBody("加入登录页面。"))).toEqual([])
  })

  it("accepts an English body by default", () => {
    expect(lintCommitMessage(withBody("Add a login page."))).toEqual([])
  })

  it("rejects an English body when Chinese is required", () => {
    const message = withBody("Add a login page.")
    expect(lintCommitMessage(message, { chineseBody: true })).toEqual([
      "the body must be written in Chinese",
    ])
  })

  it("accepts a Chinese body when Chinese is required", () => {
    const message = withBody("加入登录页面。")
    expect(lintCommitMessage(message, { chineseBody: true })).toEqual([])
  })

  it("does not require a body when Chinese is required", () => {
    expect(lintCommitMessage("feat: add login", { chineseBody: true })).toEqual(
      [],
    )
  })

  it("counts Chinese characters as two columns", () => {
    expect(lintCommitMessage(withBody("字".repeat(36)))).toEqual([])
    expect(lintCommitMessage(withBody("字".repeat(37))).join()).toMatch(
      /must fit 72 columns/,
    )
  })

  it("requires a blank line after the title", () => {
    expect(lintCommitMessage("feat: add login\n加入登录页面。")).toEqual([
      "a blank line must follow the title",
    ])
  })

  it("rejects a Co-Authored-By trailer in any case", () => {
    const message = withBody("加入登录。\n\nco-authored-by: A <a@example.com>")
    expect(lintCommitMessage(message)).toEqual([
      "remove the Co-Authored-By trailer",
    ])
  })

  it("does not treat other trailers as body text", () => {
    const message = "feat: add login\n\nReviewed-by: A <a@example.com>"
    expect(lintCommitMessage(message)).toEqual([])
  })
})

describe("what git generates or strips", () => {
  it.each([
    "Merge branch 'main' into feature",
    'Revert "feat: add login"',
    "fixup! feat: add login",
    "squash! feat: add login",
    "amend! feat: add login",
  ])("ignores %s", (header) => {
    expect(lintCommitMessage(header)).toEqual([])
  })

  it("ignores comment lines", () => {
    const message = "feat: add login\n\n# Please enter the commit message\n"
    expect(lintCommitMessage(message)).toEqual([])
  })

  it("ignores the diff below the scissors of commit -v", () => {
    const message = [
      "feat: add login",
      "",
      "# ------------------------ >8 ------------------------",
      "diff --git a/a b/a",
      "+English line that is not part of the message",
    ].join("\n")
    expect(lintCommitMessage(message)).toEqual([])
  })

  it("tolerates Windows line endings", () => {
    expect(lintCommitMessage("feat: add login\r\n\r\n加入登录。\r\n")).toEqual(
      [],
    )
  })
})
