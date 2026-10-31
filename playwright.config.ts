import process from "node:process"

import { defineConfig } from "@playwright/test"

export default defineConfig({
  testDir: "e2e",
  use: { baseURL: "http://localhost:4173" },
  webServer: [
    {
      command: "pnpm --filter api start",
      port: 8787,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: "pnpm --filter web preview --strictPort",
      port: 4173,
      reuseExistingServer: !process.env.CI,
    },
  ],
})
