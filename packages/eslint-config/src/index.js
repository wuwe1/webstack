import antfu from "@antfu/eslint-config"

const noClassComponents = {
  "react/no-access-state-in-setstate": "off",
  "react/no-component-will-mount": "off",
  "react/no-component-will-receive-props": "off",
  "react/no-component-will-update": "off",
  "react/no-direct-mutation-state": "off",
  "react/no-set-state-in-component-did-mount": "off",
  "react/no-set-state-in-component-did-update": "off",
  "react/no-set-state-in-component-will-update": "off",
  "react/no-unsafe-component-will-mount": "off",
  "react/no-unsafe-component-will-receive-props": "off",
  "react/no-unsafe-component-will-update": "off",
  "react/no-unused-class-component-members": "off",
}

// Cannot fire in an ESM-only React 19 project without `var`.
const unreachable = {
  "block-scoped-var": "off",
  "command/command": "off",
  "node/handle-callback-err": "off",
  "node/no-exports-assign": "off",
  "node/no-new-require": "off",
  "node/no-path-concat": "off",
  "react/dom-no-find-dom-node": "off",
  "react/dom-no-hydrate": "off",
  "react/dom-no-render": "off",
  "react/dom-no-render-return-value": "off",
  "react/rsc-function-definition": "off",
  "unicorn/no-new-buffer": "off",
  "vars-on-top": "off",
}

// Another enabled rule reports the same code.
const duplicates = {
  "ts/no-extra-non-null-assertion": "off",
  "ts/no-import-type-side-effects": "off",
  "ts/no-non-null-asserted-nullish-coalescing": "off",
  "ts/no-non-null-asserted-optional-chain": "off",
  "unicorn/prefer-includes": "off",
}

// tsc rejects these with the options in tsconfig.base.json.
const coveredByTsc = {
  "no-delete-var": "off",
  "no-fallthrough": "off",
  "no-octal": "off",
  "no-octal-escape": "off",
  "no-restricted-syntax": "off",
  "ts/no-dupe-class-members": "off",
  "ts/no-duplicate-enum-values": "off",
  "ts/no-redeclare": "off",
  "ts/prefer-literal-enum-member": "off",
  "unused-imports/no-unused-vars": "off",
}

const typeSafety = {
  "eslint-comments/require-description": "error",
  "ts/consistent-type-assertions": ["error", { assertionStyle: "never" }],
  "ts/max-params": ["error", { max: 2 }],
  "ts/no-explicit-any": "error",
  "ts/no-floating-promises": "error",
  "ts/no-misused-promises": "error",
  "ts/no-non-null-assertion": "error",
  "ts/no-unsafe-argument": "error",
  "ts/no-unsafe-assignment": "error",
  "ts/no-unsafe-call": "error",
  "ts/no-unsafe-member-access": "error",
  "ts/no-unsafe-return": "error",
  "ts/switch-exhaustiveness-check": "error",
}

const testQuality = {
  "test/expect-expect": "error",
  "test/no-disabled-tests": "error",
}

export default function webstack(...overrides) {
  return antfu(
    { jsdoc: false, markdown: false, react: true, stylistic: false },
    {
      rules: {
        ...noClassComponents,
        ...unreachable,
        // Oxfmt owns import order.
        "perfectionist/sort-imports": "off",
        "test/prefer-lowercase-title": "off",
      },
    },
    {
      files: ["**/*.{ts,tsx}"],
      languageOptions: { parserOptions: { projectService: true } },
      rules: { ...coveredByTsc, ...duplicates, ...typeSafety },
    },
    {
      files: ["**/*.test.{ts,tsx}"],
      rules: testQuality,
    },
    {
      files: ["pnpm-workspace.yaml"],
      rules: {
        "pnpm/yaml-enforce-settings": [
          "error",
          { settings: { shellEmulator: true, trustPolicy: "no-downgrade" } },
        ],
      },
    },
    {
      // TanStack Router requires each route file to export `Route`.
      files: ["**/routes/**/*.tsx"],
      rules: { "react-refresh/only-export-components": "off" },
    },
    ...overrides,
  )
    .remove("antfu/jsonc/rules")
    .remove("antfu/pnpm/pnpm-workspace-yaml-sort")
    .remove("antfu/sort/package-json")
    .remove("antfu/sort/tsconfig-json")
    .remove("antfu/yaml/rules")
}
