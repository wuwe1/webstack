# webstack

A light full-stack web template built on one rule: don't reinvent the wheel.

## Stack

| Area   | Choice                                                                                                 |
| ------ | ------------------------------------------------------------------------------------------------------ |
| Base   | React with React Compiler, Vite, TypeScript, pnpm workspaces with catalogs                             |
| UI     | Tailwind CSS v4, shadcn/ui on Base UI, Fontsource                                                      |
| Data   | TanStack Router, TanStack Query, TanStack Table, Valibot                                               |
| API    | Hono with its typed `hc` client                                                                        |
| Checks | Oxfmt, ESLint, dependency-cruiser, Knip, Vitest, happy-dom, Playwright, size-limit, Lefthook, gitleaks |

## Layout

| Path        | What lives there                                                      |
| ----------- | --------------------------------------------------------------------- |
| `apps/`     | What gets deployed: `web` and `api`                                   |
| `packages/` | Runtime code shared by apps. Absent until both apps run the same code |
| `tooling/`  | Repo checks only, never code that ships                               |
| `e2e/`      | Playwright tests                                                      |

## Getting started

```bash
pnpm install
pnpm exec playwright install chromium
pnpm dev
```

The web app runs on http://localhost:5173 and proxies `/api` to the API on port 8787.

## Commands

| Command          | What it does                                                           |
| ---------------- | ---------------------------------------------------------------------- |
| `pnpm check`     | Runs everything below                                                  |
| `pnpm secrets`   | Scans the git history for secrets with gitleaks                        |
| `pnpm typecheck` | Type checks every package                                              |
| `pnpm fmt`       | Formats the code                                                       |
| `pnpm lint`      | Lints with type information                                            |
| `pnpm arch`      | Checks the direction of imports                                        |
| `pnpm knip`      | Finds unused files, exports and dependencies                           |
| `pnpm test`      | Runs unit tests                                                        |
| `pnpm build`     | Builds the web app                                                     |
| `pnpm size`      | Fails if the JavaScript bundle is over budget                          |
| `pnpm e2e`       | Builds the web app, then tests it with the real API through Playwright |

## Commit messages

`tooling/commit-msg` requires a Conventional Commits title of up to 50 characters and body lines of up to 72 columns, and refuses `Co-Authored-By`. To also require a Chinese body, add `--chinese-body` to the `commit-msg` command in `lefthook.yml`.
