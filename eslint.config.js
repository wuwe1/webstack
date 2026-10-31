import webstack from "@webstack/eslint-config"

export default webstack(
  {
    ignores: [
      ".claude/worktrees/**",
      "apps/web/src/components/ui/**",
      "apps/web/src/routeTree.gen.ts",
      "tooling/arch-rules/fixtures/**",
      "tooling/eslint-config/fixtures/**",
    ],
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: { tsconfigRootDir: import.meta.dirname },
    },
  },
)
