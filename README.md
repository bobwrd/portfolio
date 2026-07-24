# Arin Jain — Portfolio

Personal site with four co-equal sections, served from a single Cloudflare Worker.

- **`/`** — landing page. A LaTeX/academic-paper-styled hub (title block, Abstract, Focus Areas, Projects, Appendix) linking into each section below.
- **`/writing`** — Margin of Error. Writing only: weekly briefing, personal pieces, analysis, about, why, changed-my-mind, changelog, contact.
- **`/mini`** — Mini Projects. Six standalone interactive tools, each with its own theme and data pipeline: The Verdict, The Ledger, The Observatory, The Arena, The Distribution Lab, The Docket.
- **`/onebook`** — OneBook. A risk dashboard for a mixed book of equities, options, and bonds — correlation, VaR, Greeks, scenario engine — with an optional connected-broker mode (Alpaca, Tradier, Schwab).
- **`/ask`** — Ask. A showcase for a beginner-friendly data-analysis language, with downloads for the standalone macOS app.

Each section keeps its own internal navigation; a small `SectionSwitcher` corner widget (not a persistent top bar) is the only thing shared across all four.

## Stack

- Frontend: React 19 + Vite 7 + Tailwind 4 + React Router 7, in `apps/web`.
- API: a single Hono app in `worker/`. Margin of Error and Mini Projects routes live under `/api/*` (`worker/moe.ts`); OneBook's routes are namespaced under `/api/onebook/*` (`worker/onebook/`), mounted via `app.route()` so no path changes were needed inside OneBook's own route definitions.
- `packages/finance` — OneBook's pure-TypeScript risk engine (Black-Scholes, exposure, scenario analysis, FIFO realized P&L), zero I/O, imported by both the Worker and the dashboard so both sides agree on every number.
- Content pipeline: `scripts/bake-content.mjs` reads `content/` (articles, profile, Verdict cases, Ledger actions, Observatory/Distribution Lab datasets) into `worker/generated/content.json` at build time — Workers have no filesystem at runtime.
- Two D1 databases, kept separate: `MOE_DB` (likes, contact submissions, newsletter signups, Verdict drafts) and `DB` (OneBook: users, portfolios, broker connections, sessions) — plus one KV namespace (OneBook sessions/OAuth state).

## Development

```bash
npm install
npm run build         # bakes content + builds the frontend
npm run dev:web        # Vite dev server for apps/web
npm run dev:worker     # wrangler dev, serving the built assets + API
```

Copy `.dev.vars.example` to `.dev.vars` (gitignored) for local secrets — required for OneBook auth/broker routes to work under `wrangler dev`.

## Tests

```bash
npm run test            # everything
npm run test:finance    # packages/finance — risk engine (159 tests)
npm run test:worker     # worker/ — OneBook API (92 tests)
npm run test:web        # apps/web — includes the OneBook dashboard suites (77 tests)
```

## Deploy

```bash
npm run deploy   # build + wrangler deploy
```

Before the first deploy: set every secret listed at the bottom of `wrangler.toml` (`npx wrangler secret put <NAME>`), confirm `[vars].APP_ORIGIN`/`API_ORIGIN` match the real deployed origin, and register `https://<origin>/api/onebook/callback/{alpaca,tradier,schwab}` as the OAuth redirect URI with each broker that needs one.

See [ARCHITECTURE.md](ARCHITECTURE.md) for full routing details, the content pipeline, and data model.
