const HEADER_MAX_LENGTH = 50
const BODY_MAX_WIDTH = 72

const TYPES = [
  "build",
  "chore",
  "ci",
  "docs",
  "feat",
  "fix",
  "perf",
  "refactor",
  "revert",
  "style",
  "test",
]

const HEADER = /^(?<type>\w+)(?:\((?<scope>[^()]+)\))?!?: (?<subject>.+)$/
const GENERATED = /^(?:Merge |Revert |fixup! |squash! |amend! )/
const SCISSORS = /^# -+ >8 -+$/
const TRAILER = /^[a-z][a-z-]*: /i
const CO_AUTHOR = /^co-authored-by:/i
const CJK =
  /[\u2E80-\u9FFF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFF60\uFFE0-\uFFE6]/

/** Git drops comment lines and everything below the scissors of `commit -v`. */
function messageLines(raw) {
  const lines = raw.split(/\r?\n/)
  const scissors = lines.findIndex((line) => SCISSORS.test(line))
  return (scissors < 0 ? lines : lines.slice(0, scissors))
    .filter((line) => !line.startsWith("#"))
    .map((line) => line.trimEnd())
}

function displayWidth(line) {
  return [...line].reduce((width, char) => width + (CJK.test(char) ? 2 : 1), 0)
}

function lintHeader(header) {
  const errors = []
  if ([...header].length > HEADER_MAX_LENGTH) {
    errors.push(`the title must fit ${HEADER_MAX_LENGTH} characters`)
  }
  const match = HEADER.exec(header)
  if (!match) {
    errors.push('the title must look like "type(scope): subject"')
    return errors
  }
  const { type, scope, subject } = match.groups
  if (!TYPES.includes(type)) {
    errors.push(`the type must be one of: ${TYPES.join(", ")}`)
  }
  if (scope && scope !== scope.toLowerCase()) {
    errors.push("the scope must be lower case")
  }
  if (/^[A-Z]/.test(subject)) {
    errors.push("the subject must not start with a capital letter")
  }
  if (subject.endsWith(".")) {
    errors.push("the subject must not end with a period")
  }
  return errors
}

function lintBody(lines, chineseBody) {
  const errors = []
  if (lines[0]) errors.push("a blank line must follow the title")

  const body = lines.filter((line) => !TRAILER.test(line))
  for (const line of body) {
    if (displayWidth(line) > BODY_MAX_WIDTH) {
      errors.push(`body lines must fit ${BODY_MAX_WIDTH} columns: ${line}`)
    }
  }
  if (chineseBody && body.join("").trim() && !CJK.test(body.join(""))) {
    errors.push("the body must be written in Chinese")
  }
  if (lines.some((line) => CO_AUTHOR.test(line))) {
    errors.push("remove the Co-Authored-By trailer")
  }
  return errors
}

/** Returns what is wrong with a commit message, or nothing if it is fine. */
export function lintCommitMessage(raw, { chineseBody = false } = {}) {
  const [header = "", ...rest] = messageLines(raw)
  if (GENERATED.test(header)) return []
  return [...lintHeader(header), ...lintBody(rest, chineseBody)]
}
