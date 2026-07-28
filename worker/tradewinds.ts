// Tradewinds — daily trade-voyage deduction game. Mounted at /api/tradewinds
// in worker/index.ts. Puzzles and admin-added ports live in D1 (MOE_DB, the
// same database used for likes/contact/newsletter/verdict drafts) so new
// puzzles can be authored from the in-site /tradewinds/admin editor without a
// code change or redeploy.

import { Hono } from "hono";
import { PORTS, type ManifestRow, type Port, type Puzzle } from "@portfolio/tradewinds";

type Bindings = {
  MOE_DB: D1Database;
  TRADEWINDS_PASSWORD?: string;
};

const app = new Hono<{ Bindings: Bindings }>();

async function ensureSchema(db: D1Database) {
  await db.batch([
    db.prepare(
      `CREATE TABLE IF NOT EXISTS tradewinds_puzzles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        run_date TEXT NOT NULL UNIQUE,
        ship_name TEXT NOT NULL,
        currency_name TEXT NOT NULL,
        manifest_json TEXT NOT NULL,
        origin_port_id TEXT NOT NULL,
        destination_port_id TEXT NOT NULL,
        decade INTEGER NOT NULL,
        economic_role TEXT NOT NULL,
        reveal_text TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )`,
    ),
    db.prepare(
      `CREATE TABLE IF NOT EXISTS tradewinds_custom_ports (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        region TEXT NOT NULL,
        lat REAL NOT NULL,
        lon REAL NOT NULL
      )`,
    ),
  ]);
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

interface PuzzleRow {
  run_date: string;
  ship_name: string;
  currency_name: string;
  manifest_json: string;
  origin_port_id: string;
  destination_port_id: string;
  decade: number;
  economic_role: string;
  reveal_text: string;
}

function rowToPuzzle(row: PuzzleRow): Puzzle {
  return {
    runDate: row.run_date,
    shipName: row.ship_name,
    currencyName: row.currency_name,
    manifest: JSON.parse(row.manifest_json) as ManifestRow[],
    originPortId: row.origin_port_id,
    destinationPortId: row.destination_port_id,
    decade: row.decade,
    economicRole: row.economic_role as Puzzle["economicRole"],
    reveal: row.reveal_text,
  };
}

function requirePassword(c: { req: { header: (name: string) => string | undefined }; env: Bindings }) {
  const expected = c.env.TRADEWINDS_PASSWORD;
  const provided = c.req.header("x-tradewinds-password");
  return !!expected && provided === expected;
}

// ---------------------------------------------------------------------------
// Ports — bundled list merged with admin-added custom ports.
// ---------------------------------------------------------------------------
app.get("/ports", async (c) => {
  await ensureSchema(c.env.MOE_DB);
  const { results } = await c.env.MOE_DB.prepare(
    "SELECT id, name, region, lat, lon FROM tradewinds_custom_ports",
  ).all<Port>();
  return c.json({ ports: [...PORTS, ...(results ?? [])] });
});

// ---------------------------------------------------------------------------
// Today's (or any date's) puzzle. Full puzzle — including the answer — is
// returned to the client, which grades guesses locally; there is no
// visitor-auth system on this site to gate a server-side grading endpoint
// behind, so this mirrors classic client-side Wordle rather than the NYT's
// server-graded version.
// ---------------------------------------------------------------------------
// A visitor's local calendar date can be up to a day ahead of UTC, so "today
// or tomorrow" (server UTC) covers every timezone's actual "today" — anything
// further out is a future puzzle's answer and must stay unreachable from this
// unauthenticated route.
function isRequestableDate(date: string): boolean {
  const requested = new Date(`${date}T00:00:00Z`).getTime();
  const utcToday = new Date();
  const utcTodayMidnight = Date.UTC(utcToday.getUTCFullYear(), utcToday.getUTCMonth(), utcToday.getUTCDate());
  const oneDayMs = 86_400_000;
  return requested <= utcTodayMidnight + oneDayMs;
}

app.get("/puzzle", async (c) => {
  const date = c.req.query("date");
  if (!date || !DATE_RE.test(date)) {
    return c.json({ error: "Query param 'date' must be YYYY-MM-DD" }, 400);
  }
  if (!isRequestableDate(date)) {
    return c.json({ error: "No puzzle scheduled for this date" }, 404);
  }
  await ensureSchema(c.env.MOE_DB);
  const row = await c.env.MOE_DB.prepare(
    `SELECT run_date, ship_name, currency_name, manifest_json, origin_port_id,
            destination_port_id, decade, economic_role, reveal_text
     FROM tradewinds_puzzles WHERE run_date = ?`,
  )
    .bind(date)
    .first<PuzzleRow>();
  if (!row) return c.json({ error: "No puzzle scheduled for this date" }, 404);
  return c.json({ puzzle: rowToPuzzle(row) });
});

// ---------------------------------------------------------------------------
// Admin — password-gated puzzle authoring, matching worker/moe.ts's
// x-verdict-password / VERDICT_PASSWORD pattern for /verdict/submit.
// ---------------------------------------------------------------------------
app.get("/admin/puzzles", async (c) => {
  if (!requirePassword(c)) return c.json({ error: "Unauthorized" }, 401);
  await ensureSchema(c.env.MOE_DB);
  const { results } = await c.env.MOE_DB.prepare(
    "SELECT run_date, ship_name FROM tradewinds_puzzles ORDER BY run_date",
  ).all<{ run_date: string; ship_name: string }>();
  return c.json({ puzzles: results ?? [] });
});

// Full puzzle by date, regardless of `isRequestableDate` — lets the editor
// load any scheduled (including future) puzzle back into the form.
app.get("/admin/puzzle", async (c) => {
  if (!requirePassword(c)) return c.json({ error: "Unauthorized" }, 401);
  const date = c.req.query("date");
  if (!date || !DATE_RE.test(date)) {
    return c.json({ error: "Query param 'date' must be YYYY-MM-DD" }, 400);
  }
  await ensureSchema(c.env.MOE_DB);
  const row = await c.env.MOE_DB.prepare(
    `SELECT run_date, ship_name, currency_name, manifest_json, origin_port_id,
            destination_port_id, decade, economic_role, reveal_text
     FROM tradewinds_puzzles WHERE run_date = ?`,
  )
    .bind(date)
    .first<PuzzleRow>();
  if (!row) return c.json({ error: "No puzzle scheduled for this date" }, 404);
  return c.json({ puzzle: rowToPuzzle(row) });
});

app.post("/admin/puzzle", async (c) => {
  if (!requirePassword(c)) return c.json({ error: "Unauthorized" }, 401);

  const body = await c.req.json<Puzzle>();
  if (!body.runDate || !DATE_RE.test(body.runDate)) {
    return c.json({ error: "runDate must be YYYY-MM-DD" }, 400);
  }
  if (!body.shipName || !body.originPortId || !body.destinationPortId || !body.economicRole) {
    return c.json({ error: "Missing required puzzle fields" }, 400);
  }

  await ensureSchema(c.env.MOE_DB);
  await c.env.MOE_DB.prepare(
    `INSERT INTO tradewinds_puzzles
       (run_date, ship_name, currency_name, manifest_json, origin_port_id,
        destination_port_id, decade, economic_role, reveal_text)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(run_date) DO UPDATE SET
       ship_name = excluded.ship_name,
       currency_name = excluded.currency_name,
       manifest_json = excluded.manifest_json,
       origin_port_id = excluded.origin_port_id,
       destination_port_id = excluded.destination_port_id,
       decade = excluded.decade,
       economic_role = excluded.economic_role,
       reveal_text = excluded.reveal_text`,
  )
    .bind(
      body.runDate,
      body.shipName,
      body.currencyName ?? "",
      JSON.stringify(body.manifest ?? []),
      body.originPortId,
      body.destinationPortId,
      body.decade,
      body.economicRole,
      body.reveal ?? "",
    )
    .run();

  return c.json({ success: true });
});

app.post("/admin/port", async (c) => {
  if (!requirePassword(c)) return c.json({ error: "Unauthorized" }, 401);

  const body = await c.req.json<Port>();
  if (!body.id || !body.name || !body.region || typeof body.lat !== "number" || typeof body.lon !== "number") {
    return c.json({ error: "Missing required port fields" }, 400);
  }

  await ensureSchema(c.env.MOE_DB);
  await c.env.MOE_DB.prepare(
    `INSERT INTO tradewinds_custom_ports (id, name, region, lat, lon)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET name = excluded.name, region = excluded.region,
       lat = excluded.lat, lon = excluded.lon`,
  )
    .bind(body.id, body.name, body.region, body.lat, body.lon)
    .run();

  return c.json({ success: true });
});

export default app;
