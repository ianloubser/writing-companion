# writing-companion

An AI sidebar writing companion. AI should help critique and guide writing,
not do it for us.

## Stack

- **Monorepo:** pnpm workspaces + Turborepo
- **API:** Cloudflare Workers + [Hono](https://hono.dev/), Better Auth, D1,
  Workers AI (`@cf/meta/llama-3-8b-instruct`)
- **Web:** Vite + React, [Plate.js](https://platejs.org) editor, Zustand

## Layout

```text
apps/
  api/     # Hono worker: /api/auth/* (Better Auth), /api/ai/* (SSE suggestions)
  web/     # Vite SPA: Plate editor + AI sidebar
packages/
  db/      # D1 schema.sql, Better Auth init, document queries
  types/   # Shared AI request/response payloads
```

## Getting started

Requires Node 20+ and pnpm 9.

```bash
pnpm install
pnpm --filter api dev    # Worker on :8787
pnpm --filter web dev    # SPA on :5173, proxies /api to the worker
```

Create the local D1 database (first time):

```bash
pnpm --filter api db:generate
```

Set `database_id` in `apps/api/wrangler.toml` and replace the dev-only
`BETTER_AUTH_SECRET` with `wrangler secret put BETTER_AUTH_SECRET` for
production.

## Scripts

```bash
pnpm dev        # run all dev servers
pnpm build      # build all packages/apps
pnpm lint       # eslint (flat config)
pnpm test       # vitest
pnpm typecheck  # tsc --noEmit
```
