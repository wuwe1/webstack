# @webstack/eslint-config

Every enabled rule is listed in `src/rules.js`, and `src/index.js` decides which files each list applies to.

## Changing a rule

Add a line to `fixtures/` and run `pnpm --filter @webstack/eslint-config test`. A fixture line names the rules it must trigger:

```ts
export const loose = (value: unknown) => value == 1 // expect: eqeqeq
```

The test compares every line in both directions, so it fails when a rule stops firing and when an unexpected one starts.

## Upgrading plugins

Read the changelog of each major version. New rules stay off until they are added to `src/rules.js`, and renamed or removed rules fail the run.

## Left out on purpose

- Rules that `tsc` already enforces with `tsconfig.base.json`, such as duplicate members, enums and unused variables.
- Rules for class components and server components.
- Layout rules: Oxfmt owns formatting, including import order.
