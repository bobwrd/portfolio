# Arin Jain — Portfolio

Personal site with four co-equal sections, served from a single Cloudflare Worker.

- **`/`** — landing page. A paper-styled hub: abstract, focus areas, projects, and links into each section below.
- **`/writing`** — Margin of Error. Essays, weekly briefing, personal pieces, profile, contact.
- **`/mini`** — Mini Projects. Six standalone interactive tools: Verdict, Ledger, Observatory, Arena, Distribution Lab, Docket.
- **`/onebook`** — OneBook. A risk dashboard for a mixed book of equities and options, with an optional connected-broker mode.
- **`/ask`** — Ask. A showcase for a beginner-friendly data-analysis language, with downloads for the macOS app.

## Stack

- Frontend: React 19 + Vite 7 + Tailwind 4 + React Router 7, in `apps/web`.
- API: a single Hono app in `worker/`, deployed as one Cloudflare Worker. Margin of Error and Mini Projects routes live under `/api/*`; OneBook's routes are namespaced under `/api/onebook/*`.
- `packages/finance` — a pure-TypeScript risk engine (Black-Scholes, exposure, scenario analysis, FIFO realized P&L) used by OneBook's API and dashboard.
- Two D1 databases: one for Margin of Error (likes, contact submissions, newsletter signups, Verdict drafts), one for OneBook (users, portfolios, broker connections, sessions).

## Development

```bash
npm install
npm run build        # bakes content + builds the frontend
npm run dev:web       # Vite dev server for apps/web
npm run dev:worker    # wrangler dev, serving the built assets + API
```

## Tests

```bash
npm run test:finance   # packages/finance vitest suite
npm run test:worker    # worker/ vitest suite (OneBook API)
npm run test:web       # apps/web vitest suite
```

## Deploy

```bash
npm run deploy   # build + wrangler deploy
```

See [ARCHITECTURE.md](ARCHITECTURE.md) for routing details, content pipeline, and deploy configuration.
