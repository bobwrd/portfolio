/**
 * Tradewinds API — schema/seed idempotency isn't separately tested (there is
 * no seed step server-side; the bundled port list lives in code and only
 * admin-added ports ever reach D1), but the puzzle/ports/admin routes, the
 * future-date guard, and the password gate are exercised against a small
 * in-memory D1 stand-in.
 */

import { describe, expect, it } from "vitest";
import app from "./tradewinds.js";

interface Tables {
  puzzles: Record<string, unknown>[];
  customPorts: Record<string, unknown>[];
}

function fakeDb(tables: Tables) {
  const db = {
    async batch(_statements: unknown[]) {
      return [];
    },
    prepare(sql: string) {
      let bound: unknown[] = [];
      return {
        bind(...args: unknown[]) {
          bound = args;
          return this;
        },
        async first<T>(): Promise<T | null> {
          if (sql.includes("FROM tradewinds_puzzles")) {
            return (tables.puzzles.find((p) => p.run_date === bound[0]) as T) ?? null;
          }
          return null;
        },
        async all<T>(): Promise<{ results: T[] }> {
          if (sql.includes("FROM tradewinds_custom_ports")) {
            return { results: tables.customPorts as T[] };
          }
          if (sql.includes("FROM tradewinds_puzzles")) {
            return {
              results: tables.puzzles.map((p) => ({
                run_date: p.run_date,
                ship_name: p.ship_name,
              })) as T[],
            };
          }
          return { results: [] };
        },
        async run() {
          if (sql.includes("INSERT INTO tradewinds_puzzles")) {
            const [
              run_date,
              ship_name,
              currency_name,
              manifest_json,
              origin_port_id,
              destination_port_id,
              decade,
              economic_role,
              reveal_text,
            ] = bound;
            tables.puzzles = tables.puzzles.filter((p) => p.run_date !== run_date);
            tables.puzzles.push({
              run_date,
              ship_name,
              currency_name,
              manifest_json,
              origin_port_id,
              destination_port_id,
              decade,
              economic_role,
              reveal_text,
            });
            return { success: true };
          }
          if (sql.includes("INSERT INTO tradewinds_custom_ports")) {
            const [id, name, region, lat, lon] = bound;
            tables.customPorts = tables.customPorts.filter((p) => p.id !== id);
            tables.customPorts.push({ id, name, region, lat, lon });
            return { success: true };
          }
          return { success: true };
        },
      };
    },
  };
  return db as unknown as D1Database;
}

function env(db: D1Database, password = "secret") {
  return { MOE_DB: db, TRADEWINDS_PASSWORD: password };
}

function freshTables(): Tables {
  return { puzzles: [], customPorts: [] };
}

/** UTC YYYY-MM-DD, `daysOffset` days from now — used instead of hardcoded
 * dates so the future-date guard tests stay correct on any run date. */
function utcDate(daysOffset: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + daysOffset);
  return d.toISOString().slice(0, 10);
}

describe("GET /ports", () => {
  it("returns the bundled list merged with custom ports", async () => {
    const tables = freshTables();
    tables.customPorts.push({ id: "new-port", name: "New Port", region: "Atlantic", lat: 1, lon: 2 });
    const res = await app.request("/ports", {}, env(fakeDb(tables)));
    const body = await res.json<{ ports: { id: string }[] }>();
    expect(body.ports.some((p) => p.id === "manila")).toBe(true);
    expect(body.ports.some((p) => p.id === "new-port")).toBe(true);
  });
});

describe("GET /puzzle", () => {
  it("400s on a missing/invalid date", async () => {
    const res = await app.request("/puzzle?date=not-a-date", {}, env(fakeDb(freshTables())));
    expect(res.status).toBe(400);
  });

  it("404s when nothing is scheduled for that date", async () => {
    const res = await app.request(`/puzzle?date=${utcDate(0)}`, {}, env(fakeDb(freshTables())));
    expect(res.status).toBe(404);
  });

  it("returns the puzzle once one is scheduled for today", async () => {
    const tables = freshTables();
    tables.puzzles.push({
      run_date: utcDate(0),
      ship_name: "Test Ship",
      currency_name: "reales",
      manifest_json: JSON.stringify([{ good: "silk", revealAt: null }]),
      origin_port_id: "manila",
      destination_port_id: "acapulco",
      decade: 1590,
      economic_role: "Entrepôt / middleman",
      reveal_text: "It really happened.",
    });
    const res = await app.request(`/puzzle?date=${utcDate(0)}`, {}, env(fakeDb(tables)));
    expect(res.status).toBe(200);
    const body = await res.json<{ puzzle: { shipName: string; manifest: unknown[] } }>();
    expect(body.puzzle.shipName).toBe("Test Ship");
    expect(body.puzzle.manifest).toEqual([{ good: "silk", revealAt: null }]);
  });

  it("also serves tomorrow (a timezone ahead of UTC may already consider it 'today')", async () => {
    const tables = freshTables();
    tables.puzzles.push({
      run_date: utcDate(1),
      ship_name: "Tomorrow Ship",
      currency_name: "reales",
      manifest_json: JSON.stringify([]),
      origin_port_id: "manila",
      destination_port_id: "acapulco",
      decade: 1600,
      economic_role: "Re-export hub",
      reveal_text: "…",
    });
    const res = await app.request(`/puzzle?date=${utcDate(1)}`, {}, env(fakeDb(tables)));
    expect(res.status).toBe(200);
  });

  it("refuses to serve a puzzle scheduled further in the future, even if one exists", async () => {
    const tables = freshTables();
    tables.puzzles.push({ run_date: utcDate(30), ship_name: "Future Ship" });
    const res = await app.request(`/puzzle?date=${utcDate(30)}`, {}, env(fakeDb(tables)));
    expect(res.status).toBe(404);
  });
});

const PUZZLE_PAYLOAD = {
  runDate: "2026-08-01",
  shipName: "New Voyage",
  currencyName: "taels",
  manifest: [{ good: "tea", revealAt: null }],
  originPortId: "guangzhou",
  destinationPortId: "amsterdam",
  decade: 1700,
  economicRole: "Re-export hub",
  reveal: "Reveal text.",
};

describe("POST /admin/puzzle", () => {
  it("rejects requests without the correct password", async () => {
    const res = await app.request(
      "/admin/puzzle",
      {
        method: "POST",
        headers: { "content-type": "application/json", "x-tradewinds-password": "wrong" },
        body: JSON.stringify(PUZZLE_PAYLOAD),
      },
      env(fakeDb(freshTables())),
    );
    expect(res.status).toBe(401);
  });

  it("upserts a puzzle with the correct password", async () => {
    const tables = freshTables();
    const db = fakeDb(tables);
    const res = await app.request(
      "/admin/puzzle",
      {
        method: "POST",
        headers: { "content-type": "application/json", "x-tradewinds-password": "secret" },
        body: JSON.stringify(PUZZLE_PAYLOAD),
      },
      env(db),
    );
    expect(res.status).toBe(200);
    expect(tables.puzzles).toHaveLength(1);
    expect(tables.puzzles[0].ship_name).toBe("New Voyage");

    // Re-submitting the same run_date updates in place rather than duplicating.
    await app.request(
      "/admin/puzzle",
      {
        method: "POST",
        headers: { "content-type": "application/json", "x-tradewinds-password": "secret" },
        body: JSON.stringify({ ...PUZZLE_PAYLOAD, shipName: "Renamed Voyage" }),
      },
      env(db),
    );
    expect(tables.puzzles).toHaveLength(1);
    expect(tables.puzzles[0].ship_name).toBe("Renamed Voyage");
  });
});

describe("GET /admin/puzzles", () => {
  it("requires the password", async () => {
    const res = await app.request("/admin/puzzles", {}, env(fakeDb(freshTables())));
    expect(res.status).toBe(401);
  });

  it("lists scheduled puzzles by date", async () => {
    const tables = freshTables();
    tables.puzzles.push({ run_date: "2026-07-28", ship_name: "A" });
    tables.puzzles.push({ run_date: "2026-07-29", ship_name: "B" });
    const res = await app.request(
      "/admin/puzzles",
      { headers: { "x-tradewinds-password": "secret" } },
      env(fakeDb(tables)),
    );
    const body = await res.json<{ puzzles: { run_date: string }[] }>();
    expect(body.puzzles.map((p) => p.run_date)).toEqual(["2026-07-28", "2026-07-29"]);
  });
});

describe("GET /admin/puzzle", () => {
  it("requires the password", async () => {
    const res = await app.request(`/admin/puzzle?date=${utcDate(30)}`, {}, env(fakeDb(freshTables())));
    expect(res.status).toBe(401);
  });

  it("returns a far-future puzzle for editing, bypassing the public date guard", async () => {
    const tables = freshTables();
    tables.puzzles.push({
      run_date: utcDate(30),
      ship_name: "Future Ship",
      currency_name: "taels",
      manifest_json: JSON.stringify([]),
      origin_port_id: "manila",
      destination_port_id: "acapulco",
      decade: 1600,
      economic_role: "Re-export hub",
      reveal_text: "…",
    });
    const res = await app.request(
      `/admin/puzzle?date=${utcDate(30)}`,
      { headers: { "x-tradewinds-password": "secret" } },
      env(fakeDb(tables)),
    );
    expect(res.status).toBe(200);
    const body = await res.json<{ puzzle: { shipName: string } }>();
    expect(body.puzzle.shipName).toBe("Future Ship");
  });
});

describe("POST /admin/port", () => {
  it("requires the password", async () => {
    const res = await app.request(
      "/admin/port",
      { method: "POST", body: JSON.stringify({ id: "x", name: "X", region: "Atlantic", lat: 0, lon: 0 }) },
      env(fakeDb(freshTables())),
    );
    expect(res.status).toBe(401);
  });

  it("inserts a new custom port", async () => {
    const tables = freshTables();
    const res = await app.request(
      "/admin/port",
      {
        method: "POST",
        headers: { "content-type": "application/json", "x-tradewinds-password": "secret" },
        body: JSON.stringify({ id: "new-port", name: "New Port", region: "Atlantic", lat: 1, lon: 2 }),
      },
      env(fakeDb(tables)),
    );
    expect(res.status).toBe(200);
    expect(tables.customPorts).toHaveLength(1);
  });
});
