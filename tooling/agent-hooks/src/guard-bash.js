const QUOTED = /"[^"]*"|'[^']*'/g
const SEPARATOR = /&&|\|\||[;|\n]/
const GIT = /(?:^|\s)git\s/
const LEFTHOOK_OFF = /(?:^|\s|:)LEFTHOOK(?:_BIN|_CONFIG|_EXCLUDE)?\s*=/i

const BYPASSES = [
  { pattern: /\s--no-verify(?:\s|$)/, name: "--no-verify" },
  { pattern: /\bcommit\b.*\s-[a-z]*n/, name: "git commit -n" },
  { pattern: /core\.hookspath/i, name: "core.hooksPath" },
]

/**
 * Returns the name of the hook bypass in a shell command, or undefined.
 * Quoted text is ignored, so a commit message may mention the flags.
 */
export function findHookBypass(command) {
  const unquoted = command.replaceAll(QUOTED, '""')
  const segments = unquoted.split(SEPARATOR).filter((part) => GIT.test(part))
  if (segments.length > 0 && LEFTHOOK_OFF.test(unquoted)) return "LEFTHOOK"
  for (const segment of segments) {
    const bypass = BYPASSES.find(({ pattern }) => pattern.test(segment))
    if (bypass) return bypass.name
  }
  return undefined
}
