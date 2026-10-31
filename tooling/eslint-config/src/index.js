import e18e from "@e18e/eslint-plugin"
import comments from "@eslint-community/eslint-plugin-eslint-comments"
import react from "@eslint-react/eslint-plugin"
import ts from "@typescript-eslint/eslint-plugin"
import tsParser from "@typescript-eslint/parser"
import vitest from "@vitest/eslint-plugin"
import antfu from "eslint-plugin-antfu"
import importLite from "eslint-plugin-import-lite"
import node from "eslint-plugin-n"
import noOnlyTests from "eslint-plugin-no-only-tests"
import perfectionist from "eslint-plugin-perfectionist"
import pnpm from "eslint-plugin-pnpm"
import reactRefresh from "eslint-plugin-react-refresh"
import regexp from "eslint-plugin-regexp"
import unicorn from "eslint-plugin-unicorn"
import unusedImports from "eslint-plugin-unused-imports"
import globals from "globals"
import * as jsoncParser from "jsonc-eslint-parser"
import * as yamlParser from "yaml-eslint-parser"

import {
  javascriptRules,
  reactRules,
  sharedRules,
  testRunnerRules,
  typescriptRules,
  unitTestRules,
} from "./rules.js"

const JS = ["**/*.{js,mjs,cjs}"]
const TS = ["**/*.{ts,tsx}"]
const TESTS = ["**/*.{test,spec}.{js,ts,tsx}"]

export default function webstack(...overrides) {
  return [
    {
      name: "webstack/ignores",
      ignores: [
        "**/node_modules",
        "**/dist",
        "**/coverage",
        "**/test-results",
        "**/playwright-report",
      ],
    },
    {
      name: "webstack/shared",
      files: [...JS, ...TS],
      languageOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        globals: { ...globals.browser, ...globals.node },
      },
      linterOptions: { reportUnusedDisableDirectives: "error" },
      plugins: {
        antfu,
        e18e,
        "eslint-comments": comments,
        import: importLite,
        node,
        perfectionist,
        regexp,
        unicorn,
        "unused-imports": unusedImports,
      },
      rules: {
        ...regexp.configs["flat/recommended"].rules,
        ...sharedRules,
      },
    },
    {
      name: "webstack/javascript",
      files: JS,
      rules: javascriptRules,
    },
    {
      name: "webstack/commonjs",
      files: ["**/*.cjs"],
      languageOptions: { sourceType: "commonjs" },
    },
    {
      name: "webstack/typescript",
      files: TS,
      languageOptions: {
        parser: tsParser,
        parserOptions: {
          ecmaFeatures: { jsx: true },
          projectService: true,
        },
      },
      plugins: {
        react: react.configs.all.plugins["@eslint-react"],
        "react-refresh": reactRefresh,
        ts,
      },
      rules: { ...typescriptRules, ...reactRules },
    },
    {
      // TanStack Router requires each route file to export `Route`.
      name: "webstack/routes",
      files: ["**/routes/**/*.tsx"],
      rules: { "react-refresh/only-export-components": "off" },
    },
    {
      name: "webstack/tests",
      files: TESTS,
      plugins: { "no-only-tests": noOnlyTests, test: vitest },
      rules: {
        ...testRunnerRules,
        // Vitest's no-focused-tests does not see Playwright's `test.only`.
        "no-only-tests/no-only-tests": "error",
        "antfu/no-top-level-await": "off",
        "node/prefer-global/process": "off",
      },
    },
    {
      name: "webstack/unit-tests",
      files: ["**/*.test.{ts,tsx}"],
      rules: {
        ...unitTestRules,
        "no-restricted-syntax": [
          "error",
          {
            selector:
              "CallExpression[callee.object.name='vi'][callee.property.name='mock']",
            message:
              "Don't mock modules. Run the real code, or mock at the network boundary.",
          },
        ],
      },
    },
    {
      name: "webstack/config-files",
      files: ["**/*.config.*"],
      rules: { "antfu/no-top-level-await": "off", "no-console": "off" },
    },
    {
      // These fixers rewrite pnpm-workspace.yaml even without --fix.
      name: "webstack/package-json",
      files: ["**/package.json"],
      languageOptions: { parser: jsoncParser },
      plugins: { pnpm },
      rules: {
        "pnpm/json-enforce-catalog": ["error", { autofix: false }],
        "pnpm/json-prefer-workspace-settings": ["error", { autofix: false }],
        "pnpm/json-valid-catalog": [
          "error",
          { autofix: false, autoInsert: false },
        ],
      },
    },
    {
      name: "webstack/pnpm-workspace",
      files: ["**/pnpm-workspace.yaml"],
      languageOptions: { parser: yamlParser },
      plugins: { pnpm },
      rules: {
        "pnpm/yaml-enforce-settings": [
          "error",
          {
            autofix: false,
            settings: { shellEmulator: true, trustPolicy: "no-downgrade" },
          },
        ],
        "pnpm/yaml-no-duplicate-catalog-item": "error",
        "pnpm/yaml-no-unused-catalog-item": "error",
      },
    },
    ...overrides,
  ]
}
