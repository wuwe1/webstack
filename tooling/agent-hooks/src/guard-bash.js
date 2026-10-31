const MESSAGE =
  /(\s(?:-[a-z]*m|--message)(?:=|\s*))(?:@?"[^"]*"@?|@?'[^']*'@?)/g
const QUOTES = /["']/g
const SEPARATOR = /&&|\|\||[;|\n]/
const GIT = /(?:^|[\s\\/])git(?:\.exe)?\s/
const LEFTHOOK_OFF = /(?:^|\s|:)LEFTHOOK(?:_BIN|_CONFIG|_EXCLUDE)?\s*=/i
const HOOK_REMOVAL =
  /\blefthook(?:\.exe)?\s+uninstall\b|\b(?:rm|rmdir|del|mv|ren|Remove-Item|Move-Item|Rename-Item)\b.*\.git[\\/]hooks/i

const BYPASSES = [
  // Git accepts --no-veri and --no-verif; --no-ver is ambiguous and refused.
  { pattern: /\s--no-veri(?:fy?)?(?:\s|$)/, name: "--no-verify" },
  { pattern: /\bcommit\b.*\s-[a-z]*n/, name: "git commit -n" },
  { pattern: /core\.hookspath/i, name: "core.hooksPath" },
]

export function findHookBypass(command) {
  const plain = command.replaceAll(MESSAGE, "$1").replaceAll(QUOTES, "")
  const segments = plain.split(SEPARATOR)
  if (segments.some((part) => HOOK_REMOVAL.test(part))) return "removing hooks"
  const gitSegments = segments.filter((part) => GIT.test(part))
  if (gitSegments.length > 0 && LEFTHOOK_OFF.test(plain)) return "LEFTHOOK"
  for (const segment of gitSegments) {
    const bypass = BYPASSES.find(({ pattern }) => pattern.test(segment))
    if (bypass) return bypass.name
  }
  return undefined
}
