import type { Port, Puzzle } from "@portfolio/tradewinds";

const BASE = "/api/tradewinds";

export async function fetchPuzzle(runDate: string): Promise<Puzzle | null> {
  const res = await fetch(`${BASE}/puzzle?date=${encodeURIComponent(runDate)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to load puzzle (${res.status})`);
  const body = (await res.json()) as { puzzle: Puzzle };
  return body.puzzle;
}

export async function fetchPorts(): Promise<Port[]> {
  const res = await fetch(`${BASE}/ports`);
  if (!res.ok) throw new Error(`Failed to load ports (${res.status})`);
  const body = (await res.json()) as { ports: Port[] };
  return body.ports;
}

export async function fetchAdminPuzzles(
  password: string,
): Promise<{ run_date: string; ship_name: string }[]> {
  const res = await fetch(`${BASE}/admin/puzzles`, {
    headers: { "x-tradewinds-password": password },
  });
  if (!res.ok) throw new Error(res.status === 401 ? "Wrong password" : `Error ${res.status}`);
  const body = (await res.json()) as { puzzles: { run_date: string; ship_name: string }[] };
  return body.puzzles;
}

export async function fetchAdminPuzzle(runDate: string, password: string): Promise<Puzzle | null> {
  const res = await fetch(`${BASE}/admin/puzzle?date=${encodeURIComponent(runDate)}`, {
    headers: { "x-tradewinds-password": password },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(res.status === 401 ? "Wrong password" : `Error ${res.status}`);
  const body = (await res.json()) as { puzzle: Puzzle };
  return body.puzzle;
}

export async function submitPuzzle(puzzle: Puzzle, password: string): Promise<void> {
  const res = await fetch(`${BASE}/admin/puzzle`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-tradewinds-password": password },
    body: JSON.stringify(puzzle),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? (res.status === 401 ? "Wrong password" : `Error ${res.status}`));
  }
}

export async function submitPort(port: Port, password: string): Promise<void> {
  const res = await fetch(`${BASE}/admin/port`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-tradewinds-password": password },
    body: JSON.stringify(port),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? (res.status === 401 ? "Wrong password" : `Error ${res.status}`));
  }
}
