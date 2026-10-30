# AGENTS.md

Tools enforce the rules wherever they can. This file only holds what they cannot check.

## Done means

`pnpm check` passes. Say which steps you did not run.

## Choosing a dependency

Look in this order and stop at the first match:

1. `apps/web/src/components/ui`
2. The shadcn registry
3. `@base-ui/react`
4. A third-party library. State why, and confirm it is still maintained.

New dependencies go in the `catalog` in `pnpm-workspace.yaml`.

## Where code goes

- `routes/` only wires pages or endpoints together.
- `features/<name>/` holds one feature. Features do not import each other; move shared code down.
- `components/` and `lib/` know nothing about features.
- `packages/shared/` holds schemas used by both `web` and `api`.
- Parse external data with Zod where it enters.

## TypeScript versions

`tsc` runs TypeScript 7. The `typescript` package is the 6.0 compatibility build, because tools that need the compiler API cannot use 7 yet. Remove the alias once they support 7.

## Upgrading dependencies

Only when asked: run `npx taze -r --json`, update the catalog, then `pnpm check`.
