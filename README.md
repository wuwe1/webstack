# webstack

A light full-stack web template built on one rule: don't reinvent the wheel.

ESLint rules and agent skills are still being worked out, so they are not here yet.

## Stack

| Area   | Choice                                                                               |
| ------ | ------------------------------------------------------------------------------------ |
| Base   | React with React Compiler, Vite, TypeScript, pnpm workspaces with catalogs           |
| UI     | Tailwind CSS v4, shadcn/ui on Base UI, Fontsource                                    |
| Data   | TanStack Router, TanStack Query, TanStack Table, Valibot                             |
| API    | Hono with its typed `hc` client                                                      |
| Checks | Oxfmt, dependency-cruiser, Knip, Vitest, happy-dom, Playwright, size-limit, Lefthook |

## Getting started

```bash
pnpm install
pnpm exec playwright install chromium
pnpm dev
```

The web app runs on http://localhost:5173 and proxies `/api` to the API on port 8787.

## Commands

| Command          | What it does                                  |
| ---------------- | --------------------------------------------- |
| `pnpm check`     | Runs everything below                         |
| `pnpm typecheck` | Type checks every package                     |
| `pnpm fmt`       | Formats the code                              |
| `pnpm arch`      | Checks the direction of imports               |
| `pnpm knip`      | Finds unused files, exports and dependencies  |
| `pnpm test`      | Runs unit tests                               |
| `pnpm build`     | Builds the web app                            |
| `pnpm size`      | Fails if the JavaScript bundle is over budget |
| `pnpm e2e`       | Runs Playwright against the real app and API  |
