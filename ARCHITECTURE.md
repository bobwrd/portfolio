# Architecture

## Repo layout

```
apps/web/
  public/ask/          Ask's chart screenshots (static)
  src/
    pages/              Landing, WritingHome + MoE pages, MiniIndex, Ask,
                         verdict/ ledger/ observatory/ arena/ distlab/ docket/
    onebook/            OneBook dashboard (App, pages, components, store, api)
    tradewinds/         Tradewinds game (Shell, pages, components, lib) + admin editor
    components/         shared UI (Layout, Nav, SectionSwitcher, shadcn primitives)
  test/                 OneBook dashboard test suites (dashboard/pages) + tradewinds/ (lib unit tests)
worker/
  moe.ts                 Margin of Error + Mini Projects API (mounted at /api)
  onebook/src/            OneBook API (mounted at /api/onebook)
  onebook/test/           OneBook API test suites
  tradewinds.ts           Tradewinds API (mounted at /api/tradewinds), tradewinds.test.ts alongside it
  index.ts                Worker entry — mounts all three apps, exports default
  generated/              content.json, gitignored, produced by scripts/bake-content.mjs
packages/finance/     pure-TS risk engine (own test/ suite), used by worker/onebook and apps/web/onebook
packages/tradewinds/  pure-TS game logic (ports, roles, decade, scoring; own test/ suite), used by worker/tradewinds.ts and apps/web/tradewinds
content/              Margin of Error's baked content source (articles, verdict, ledger, observatory, distlab); content/tradewinds/seed-puzzles.json is seeded into D1 via scripts/seed-tradewinds.mjs, not baked
scripts/              content-baking, data-build, Google Drive sync, and Tradewinds seeding scripts
wrangler.toml         single Worker config: two D1 bindings, one KV binding
```

## Routing

Frontend (`apps/web/src/App.tsx`), one `BrowserRouter`:

- `/` — landing page
- `/writing`, `/writing/weekly[/:slug]`, `/writing/personal[/:slug]`, `/writing/others[/:slug]`, `/writing/about`, `/writing/why`, `/writing/changed-my-mind`, `/writing/changelog`, `/writing/contact` — Margin of Error
- `/mini`, `/mini/verdict/*`, `/mini/ledger/*`, `/mini/observatory/*`, `/mini/arena/*`, `/mini/lab/*`, `/mini/docket/*` — Mini Projects
- `/onebook/*` — OneBook dashboard, mounted as a nested `<Routes>` (see below)
- `/ask` — Ask showcase
- `/tradewinds` — Tradewinds, the daily trade-voyage deduction game; `/tradewinds/admin` is the password-gated puzzle editor (not linked from any nav — reachable only by typing the URL)

**OneBook embedding note:** `apps/web/src/onebook/App.tsx` exports two things — `OnebookApp` (routes only, no own Router; mounted at `/onebook/*` inside the unified router) and `App` (wraps `OnebookApp` in its own `BrowserRouter`, used only by the standalone dashboard/pages test suites so they keep testing it exactly as OneBook's own repo did). OneBook's internal nav uses absolute paths (`/history`, `/settings`, ...) that would resolve against the *whole site's* root under one shared router; `apps/web/src/onebook/basePath.ts`'s `onebookPath()` helper prefixes them with `/onebook` only when the app detects it's actually embedded (`window.location.pathname` starts with `/onebook`), so the same components work correctly in both contexts.

OneBook's CSS (`apps/web/src/onebook/styles.css`) is scoped under a `.onebook-app` wrapper via CSS nesting rather than global `:root` — several of its custom property names (`--border`, `--primary`) collide with Margin of Error's Tailwind theme tokens.

Worker (`worker/index.ts`):

- `/api/*` — Margin of Error + Mini Projects (content, likes, contact, newsletter, verdict, ledger, observatory, distlab)
- `/api/onebook/*` — OneBook (auth, portfolios, brokers, groups, transactions, preferences, sessions), mounted via Hono's `app.route("/api/onebook", onebook)` — no path changes needed inside OneBook's own route definitions, only the absolute URLs it builds itself (OAuth `redirectUri`, the magic-link URL) needed the `/api/onebook` prefix added explicitly.
- `/api/tradewinds/*` — Tradewinds (`GET /puzzle?date=`, `GET /ports`, and password-gated `/admin/*` routes for authoring), mounted via `app.route("/api/tradewinds", tradewinds)`. There is no visitor-auth system on this site, so `/puzzle` returns the full answer to the client and grading happens in the browser (classic client-side Wordle, not the NYT's server-graded version) — the one guard in place is that `/puzzle` refuses to serve a date more than a day past the server's UTC "today", so a future puzzle's answer can't be read early from the network tab; the password-gated `/admin/puzzle?date=` bypasses that guard so the editor can load any scheduled puzzle back into the form.

## Content pipeline

`scripts/bake-content.mjs` reads `content/articles/*.md`, `content/profile.md`, `content/verdict/verdict_cases.json`, `content/ledger/*`, `content/observatory/observatory.json`, `content/distlab/distlab.json` and writes `worker/generated/content.json`, imported directly by the worker (Workers have no filesystem at runtime). Runs automatically as part of `npm run build`.

Verdict cases are generated by an external weekly automation (Google Drive → `scripts/sync-drive.mjs`); that script's routing table no longer writes the automation's cross-post draft article into `content/articles/` — it lands in `content/verdict/cross_post_drafts/` instead, kept for reference. Verdict content lives only under `/mini/verdict`, never in the writing feed.

## Data

Two D1 databases, kept separate:

- `MOE_DB` — `likes`, `contact_submissions`, `newsletter_signups`, `verdict_drafts`, `tradewinds_puzzles`, `tradewinds_custom_ports`. Tradewinds' bundled ~70-port list lives in code (`packages/tradewinds/src/ports.ts`), not D1 — only ports added later through the admin editor land in `tradewinds_custom_ports`; `GET /api/tradewinds/ports` merges the two.
- `DB` (OneBook) — `users`, `login_tokens`, `portfolios`, `positions`, `broker_connections`, `price_cache`, `quote_cache`, `fx_rate_cache`, `groups`, `position_groups`, `news_cache`, `transactions`, `broker_connection_errors`, `user_preferences`, `sessions`. Reuses OneBook's existing live database rather than a fresh one — both this Worker and the still-live `onebook-api` Worker can read the same data safely, since sessions are cookie-scoped per origin.

`KV` — OneBook sessions and OAuth state (also reused from the existing live deployment).

Tradewinds' per-player streak, stats, and daily progress are **not** in D1 — the site has no visitor login anywhere, so they live in the browser's `localStorage` (`apps/web/src/tradewinds/lib/storage.ts`), matching real Wordle rather than a server-tracked account.

## Secrets

Set via `wrangler secret put <NAME>`, never committed (see `.dev.vars.example` for local dev):

- `VERDICT_PASSWORD` — gates `/api/verdict/submit`
- `TRADEWINDS_PASSWORD` — gates `/tradewinds/admin` and `/api/tradewinds/admin/*`
- `TOKEN_ENCRYPTION_KEY`, `STATE_SIGNING_SECRET` — OneBook auth/broker token encryption
- `ALPACA_API_KEY_ID`, `ALPACA_API_SECRET_KEY`, `ALPHA_VANTAGE_API_KEY`
- `SCHWAB_CLIENT_ID`, `SCHWAB_CLIENT_SECRET`, `TRADIER_CLIENT_ID`, `TRADIER_CLIENT_SECRET`

## Source repos

This repo was assembled from three separate, still-independently-deployed repos — `margin-of-error`, `one_book`, and `ask` — which were not modified as part of this. Code was copied and adapted, not linked or submoduled.
