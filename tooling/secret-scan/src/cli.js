import { spawnSync } from "node:child_process"
import { createHash } from "node:crypto"
import {
  chmodSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  renameSync,
  rmSync,
} from "node:fs"
import path from "node:path"
import process from "node:process"

// To upgrade, bump VERSION and copy the hashes from gitleaks_<version>_checksums.txt.
const VERSION = "8.30.1"
const ASSETS = {
  "darwin-arm64": [
    "darwin_arm64.tar.gz",
    "b40ab0ae55c505963e365f271a8d3846efbc170aa17f2607f13df610a9aeb6a5",
  ],
  "darwin-x64": [
    "darwin_x64.tar.gz",
    "dfe101a4db2255fc85120ac7f3d25e4342c3c20cf749f2c20a18081af1952709",
  ],
  "linux-arm64": [
    "linux_arm64.tar.gz",
    "e4a487ee7ccd7d3a7f7ec08657610aa3606637dab924210b3aee62570fb4b080",
  ],
  "linux-x64": [
    "linux_x64.tar.gz",
    "551f6fc83ea457d62a0d98237cbad105af8d557003051f41f3e7ca7b3f2470eb",
  ],
  "win32-arm64": [
    "windows_arm64.zip",
    "b95f5e4f5c425cedca7ee203d9afd29597e692c4924a12ed42f970537c72cc0f",
  ],
  "win32-x64": [
    "windows_x64.zip",
    "d29144deff3a68aa93ced33dddf84b7fdc26070add4aa0f4513094c8332afc4e",
  ],
}
const IS_WINDOWS = process.platform === "win32"
const EXECUTABLE = IS_WINDOWS ? "gitleaks.exe" : "gitleaks"
const CACHE = path.join(
  import.meta.dirname,
  "../node_modules/.cache/gitleaks",
  VERSION,
)
const BINARY = path.join(CACHE, EXECUTABLE)
// Windows' own tar reads zip files. The one Git Bash puts first on PATH does not.
const TAR = IS_WINDOWS
  ? path.join(process.env.SystemRoot, "System32/tar.exe")
  : "tar"

function run(command, args, cwd) {
  const { error, status } = spawnSync(command, args, { cwd, stdio: "inherit" })
  if (error) throw error
  if (status !== 0) throw new Error(`${command} exited with ${status}`)
}

function install() {
  const platform = `${process.platform}-${process.arch}`
  const asset = ASSETS[platform]
  if (!asset) throw new Error(`no gitleaks build for ${platform}`)
  const [suffix, sha256] = asset
  const name = `gitleaks_${VERSION}_${suffix}`
  const url = `https://github.com/gitleaks/gitleaks/releases/download/v${VERSION}/${name}`

  console.error(
    `secret-scan: downloading gitleaks ${VERSION}, needed only once`,
  )
  mkdirSync(path.dirname(CACHE), { recursive: true })
  const temp = mkdtempSync(`${CACHE}-`)
  try {
    // Unlike fetch, curl honours HTTPS_PROXY on every Node version.
    const limits = ["--connect-timeout", "20", "--max-time", "300"]
    const retries = ["--retry", "3", "--retry-all-errors"]
    run("curl", ["-fsSL", ...limits, ...retries, "-o", name, url], temp)
    const archive = readFileSync(path.join(temp, name))
    const actual = createHash("sha256").update(archive).digest("hex")
    if (actual !== sha256) {
      throw new Error(`checksum mismatch for ${name}: ${actual}`)
    }
    run(TAR, ["-xf", name, EXECUTABLE], temp)
    rmSync(path.join(temp, name))
    chmodSync(path.join(temp, EXECUTABLE), 0o755)
    rmSync(CACHE, { force: true, recursive: true })
    renameSync(temp, CACHE)
  } finally {
    rmSync(temp, { force: true, recursive: true })
  }
}

// Fails closed: without a verified scanner, the commit is refused.
try {
  if (!existsSync(BINARY)) install()
  const { error, status } = spawnSync(BINARY, process.argv.slice(2), {
    stdio: "inherit",
  })
  if (error) throw error
  process.exitCode = status ?? 2
} catch (error) {
  console.error(`secret-scan: ${error.message}. Nothing was scanned.`)
  process.exitCode = 2
}
