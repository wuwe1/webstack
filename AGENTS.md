# AGENTS.md

Tools enforce the rules wherever they can. This file only holds what they cannot check.

## Done means

`pnpm check` passes. Say which steps you did not run. In Claude Code, `tooling/agent-hooks` runs it when you stop and refuses commands that skip the git hooks.

## Choosing a dependency

Look in this order and stop at the first match:

1. `apps/web/src/components/ui`
2. The shadcn registry, through `pnpm --config.minimumReleaseAge=20160 dlx shadcn@latest add`. `dlx` ignores `pnpm-workspace.yaml`, so it needs the age limit passed in.
3. `@base-ui/react`
4. A third-party library. State why, and confirm it is still maintained.

New dependencies go in the `catalog` in `pnpm-workspace.yaml`.

## Where code goes

- `routes/` only wires pages or endpoints together.
- `features/<name>/` holds one feature. Features do not import each other; move shared code down.
- `components/` and `lib/` know nothing about features.
- Types reach `web` from `api` through `hc`. Add a `packages/contracts/` only when both run the same schema, such as a form, and let it depend on nothing but Valibot.
- API errors share one shape. Return expected failures with `c.json(apiError({ code, message }), status)` so `hc` types them, and throw for bugs. On `web`, `send` turns a failed response into an `ApiError`.
- `tooling/` holds repo checks and shared config, never code that ships. `apps` and `packages` must not import it.
- Parse external data with Valibot where it enters.

## TypeScript versions

`tsc` runs TypeScript 7. The `typescript` package is the 6.0 compatibility build, because tools that need the compiler API cannot use 7 yet. Remove the alias once they support 7.

## Upgrading dependencies

Only when asked: run `npx taze -r --json --maturity-period 14`, update the catalog, then `pnpm check`.

pnpm refuses releases younger than 14 days. For an urgent security fix, add the exact version to `minimumReleaseAgeExclude` in `pnpm-workspace.yaml`. gitleaks is pinned in `tooling/secret-scan/src/cli.js`, where taze cannot see it.
