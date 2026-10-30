import webstack from "@webstack/eslint-config"

export default webstack(
  {
    ignores: ["apps/web/src/components/ui/**", "apps/web/src/routeTree.gen.ts"],
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: { tsconfigRootDir: import.meta.dirname },
    },
  },
)
