import { useEffect, useState } from "react";
import {
  DECADE_STEP,
  ECONOMIC_ROLES,
  MAX_DECADE,
  MIN_DECADE,
  eraForDecade,
  findPort,
  formatDecade,
  type EconomicRole,
  type ManifestRow,
  type Port,
  type Puzzle,
  type RevealAt,
} from "@portfolio/tradewinds";
import TradewindsShell from "../TradewindsShell";
import PortPicker, { PortDatalist } from "../components/PortPicker";
import { fetchAdminPuzzle, fetchAdminPuzzles, fetchPorts, submitPort, submitPuzzle } from "../lib/api";

interface ManifestFormRow {
  good: string;
  quantity: string;
  price: string;
  note: string;
  revealAt: "" | "3" | "5" | "7";
}

const EMPTY_ROW: ManifestFormRow = { good: "", quantity: "", price: "", note: "", revealAt: "" };

interface FormState {
  runDate: string;
  shipName: string;
  currencyName: string;
  manifest: ManifestFormRow[];
  originQuery: string;
  destQuery: string;
  decade: number;
  economicRole: EconomicRole | "";
  reveal: string;
}

function emptyForm(): FormState {
  return {
    runDate: "",
    shipName: "",
    currencyName: "",
    manifest: [{ ...EMPTY_ROW }, { ...EMPTY_ROW }, { ...EMPTY_ROW }],
    originQuery: "",
    destQuery: "",
    decade: 1500,
    economicRole: "",
    reveal: "",
  };
}

function puzzleToForm(puzzle: Puzzle, ports: Port[]): FormState {
  return {
    runDate: puzzle.runDate,
    shipName: puzzle.shipName,
    currencyName: puzzle.currencyName,
    manifest: puzzle.manifest.map((r) => ({
      good: r.good,
      quantity: r.quantity ?? "",
      price: r.price ?? "",
      note: r.note ?? "",
      revealAt: r.revealAt ? (String(r.revealAt) as "3" | "5" | "7") : "",
    })),
    originQuery: findPort(ports, puzzle.originPortId)?.name ?? "",
    destQuery: findPort(ports, puzzle.destinationPortId)?.name ?? "",
    decade: puzzle.decade,
    economicRole: puzzle.economicRole,
    reveal: puzzle.reveal,
  };
}

export default function TradewindsAdmin() {
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [unlockError, setUnlockError] = useState("");
  const [ports, setPorts] = useState<Port[]>([]);
  const [schedule, setSchedule] = useState<{ run_date: string; ship_name: string }[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPorts().then(setPorts).catch(() => {});
  }, []);

  async function handleUnlock(e: React.FormEvent) {
    e.preventDefault();
    setUnlockError("");
    try {
      const puzzles = await fetchAdminPuzzles(password);
      setSchedule(puzzles);
      setUnlocked(true);
    } catch (err) {
      setUnlockError(err instanceof Error ? err.message : "Failed to unlock");
    }
  }

  async function refreshSchedule() {
    try {
      setSchedule(await fetchAdminPuzzles(password));
    } catch {
      // non-fatal — the schedule table just won't refresh
    }
  }

  async function loadForEdit(runDate: string) {
    const puzzle = await fetchAdminPuzzle(runDate, password);
    if (puzzle) setForm(puzzleToForm(puzzle, ports));
  }

  function updateRow(i: number, patch: Partial<ManifestFormRow>) {
    setForm((f) => ({
      ...f,
      manifest: f.manifest.map((row, idx) => (idx === i ? { ...row, ...patch } : row)),
    }));
  }

  function addRow() {
    setForm((f) => ({ ...f, manifest: [...f.manifest, { ...EMPTY_ROW }] }));
  }

  function removeRow(i: number) {
    setForm((f) => ({ ...f, manifest: f.manifest.filter((_, idx) => idx !== i) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setError("");

    const originPort = ports.find((p) => p.name === form.originQuery);
    const destPort = ports.find((p) => p.name === form.destQuery);
    if (!originPort || !destPort || !form.economicRole || !form.runDate || !form.shipName) {
      setStatus("error");
      setError("Fill in run date, ship name, origin, destination, and economic role.");
      return;
    }

    const manifest: ManifestRow[] = form.manifest
      .filter((r) => r.good.trim())
      .map((r) => ({
        good: r.good,
        quantity: r.quantity || undefined,
        price: r.price || undefined,
        note: r.note || undefined,
        revealAt: (r.revealAt ? (Number(r.revealAt) as RevealAt) : null),
      }));

    const puzzle: Puzzle = {
      runDate: form.runDate,
      shipName: form.shipName,
      currencyName: form.currencyName,
      manifest,
      originPortId: originPort.id,
      destinationPortId: destPort.id,
      decade: form.decade,
      economicRole: form.economicRole,
      reveal: form.reveal,
    };

    try {
      await submitPuzzle(puzzle, password);
      setStatus("saved");
      await refreshSchedule();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Failed to save");
    }
  }

  // --- add-port mini-form -----------------------------------------------
  const [portForm, setPortForm] = useState({ id: "", name: "", region: "", lat: "", lon: "" });
  const [portStatus, setPortStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function handleAddPort(e: React.FormEvent) {
    e.preventDefault();
    setPortStatus("saving");
    const lat = Number(portForm.lat);
    const lon = Number(portForm.lon);
    if (!portForm.id || !portForm.name || !portForm.region || Number.isNaN(lat) || Number.isNaN(lon)) {
      setPortStatus("error");
      return;
    }
    try {
      await submitPort({ id: portForm.id, name: portForm.name, region: portForm.region, lat, lon }, password);
      setPorts(await fetchPorts());
      setPortForm({ id: "", name: "", region: "", lat: "", lon: "" });
      setPortStatus("saved");
    } catch {
      setPortStatus("error");
    }
  }

  if (!unlocked) {
    return (
      <TradewindsShell>
        <div className="max-w-sm mx-auto">
          <h1 className="text-xl font-bold mb-4" style={{ color: "var(--tw-text)" }}>
            Puzzle editor
          </h1>
          <form onSubmit={handleUnlock} className="space-y-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded border px-3 py-2 text-sm bg-transparent"
              style={{ borderColor: "var(--tw-border)", color: "var(--tw-text)" }}
            />
            <button
              type="submit"
              className="w-full rounded py-2 text-sm font-semibold"
              style={{ backgroundColor: "var(--tw-accent)", color: "var(--tw-surface)" }}
            >
              Unlock
            </button>
            {unlockError && <p className="text-sm text-red-600">{unlockError}</p>}
          </form>
        </div>
      </TradewindsShell>
    );
  }

  return (
    <TradewindsShell>
      <h1 className="text-2xl font-bold mb-6" style={{ color: "var(--tw-text)" }}>
        Tradewinds puzzle editor
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-6 items-start">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="rounded-lg border p-5 space-y-4" style={{ borderColor: "var(--tw-border)", backgroundColor: "var(--tw-surface)" }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--tw-muted)" }}>
                  Run date
                </label>
                <input
                  type="date"
                  value={form.runDate}
                  onChange={(e) => setForm((f) => ({ ...f, runDate: e.target.value }))}
                  className="w-full rounded border px-3 py-2 text-sm bg-transparent"
                  style={{ borderColor: "var(--tw-border)", color: "var(--tw-text)" }}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--tw-muted)" }}>
                  Ship / voyage name
                </label>
                <input
                  type="text"
                  value={form.shipName}
                  onChange={(e) => setForm((f) => ({ ...f, shipName: e.target.value }))}
                  className="w-full rounded border px-3 py-2 text-sm bg-transparent"
                  style={{ borderColor: "var(--tw-border)", color: "var(--tw-text)" }}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--tw-muted)" }}>
                Currency name (shown to players)
              </label>
              <input
                type="text"
                value={form.currencyName}
                onChange={(e) => setForm((f) => ({ ...f, currencyName: e.target.value }))}
                placeholder="e.g. silver reales"
                className="w-full rounded border px-3 py-2 text-sm bg-transparent"
                style={{ borderColor: "var(--tw-border)", color: "var(--tw-text)" }}
              />
            </div>
          </div>

          <div className="rounded-lg border p-5 space-y-4" style={{ borderColor: "var(--tw-border)", backgroundColor: "var(--tw-surface)" }}>
            <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--tw-muted)" }}>
              Manifest rows
            </h2>
            <PortDatalist ports={ports} />
            {form.manifest.map((row, i) => (
              <div key={i} className="rounded border p-3 space-y-2" style={{ borderColor: "var(--tw-border)" }}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    placeholder="Good (or hint text)"
                    value={row.good}
                    onChange={(e) => updateRow(i, { good: e.target.value })}
                    className="rounded border px-2 py-1.5 text-sm bg-transparent"
                    style={{ borderColor: "var(--tw-border)", color: "var(--tw-text)" }}
                  />
                  <input
                    placeholder="Quantity"
                    value={row.quantity}
                    onChange={(e) => updateRow(i, { quantity: e.target.value })}
                    className="rounded border px-2 py-1.5 text-sm bg-transparent"
                    style={{ borderColor: "var(--tw-border)", color: "var(--tw-text)" }}
                  />
                  <input
                    placeholder="Price"
                    value={row.price}
                    onChange={(e) => updateRow(i, { price: e.target.value })}
                    className="rounded border px-2 py-1.5 text-sm bg-transparent"
                    style={{ borderColor: "var(--tw-border)", color: "var(--tw-text)" }}
                  />
                </div>
                <input
                  placeholder="Note (optional)"
                  value={row.note}
                  onChange={(e) => updateRow(i, { note: e.target.value })}
                  className="w-full rounded border px-2 py-1.5 text-sm bg-transparent"
                  style={{ borderColor: "var(--tw-border)", color: "var(--tw-text)" }}
                />
                <div className="flex items-center gap-3">
                  <label className="text-xs" style={{ color: "var(--tw-muted)" }}>
                    Reveal
                  </label>
                  <select
                    value={row.revealAt}
                    onChange={(e) => updateRow(i, { revealAt: e.target.value as ManifestFormRow["revealAt"] })}
                    className="rounded border px-2 py-1 text-sm bg-transparent"
                    style={{ borderColor: "var(--tw-border)", color: "var(--tw-text)" }}
                  >
                    <option value="">Visible from start</option>
                    <option value="3">After guess 3</option>
                    <option value="5">After guess 5</option>
                    <option value="7">After guess 7</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => removeRow(i)}
                    className="ml-auto text-xs"
                    style={{ color: "var(--tw-muted)" }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addRow}
              className="text-sm rounded border px-3 py-1.5"
              style={{ borderColor: "var(--tw-border)", color: "var(--tw-text)" }}
            >
              + Add row
            </button>
          </div>

          <div className="rounded-lg border p-5 space-y-4" style={{ borderColor: "var(--tw-border)", backgroundColor: "var(--tw-surface)" }}>
            <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--tw-muted)" }}>
              Answer
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <PortPicker label="Origin" query={form.originQuery} onChange={(v) => setForm((f) => ({ ...f, originQuery: v }))} />
              <PortPicker label="Destination" query={form.destQuery} onChange={(v) => setForm((f) => ({ ...f, destQuery: v }))} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--tw-muted)" }}>
                Decade — {formatDecade(form.decade)}
              </label>
              <input
                type="range"
                min={MIN_DECADE}
                max={MAX_DECADE}
                step={DECADE_STEP}
                value={form.decade}
                onChange={(e) => setForm((f) => ({ ...f, decade: Number(e.target.value) }))}
                className="w-full"
              />
              {/* Players guess the era, not the decade — show which bucket this lands in. */}
              <p className="text-xs mt-1" style={{ color: "var(--tw-muted)" }}>
                Players will guess:{" "}
                <strong style={{ color: "var(--tw-text)" }}>{eraForDecade(form.decade).label}</strong>{" "}
                ({eraForDecade(form.decade).range})
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--tw-muted)" }}>
                Economic role
              </label>
              <select
                value={form.economicRole}
                onChange={(e) => setForm((f) => ({ ...f, economicRole: e.target.value as EconomicRole }))}
                className="w-full rounded border px-3 py-2 text-sm bg-transparent"
                style={{ borderColor: "var(--tw-border)", color: "var(--tw-text)" }}
              >
                <option value="">Select a role…</option>
                {ECONOMIC_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--tw-muted)" }}>
                "What really happened" reveal paragraph
              </label>
              <textarea
                rows={4}
                value={form.reveal}
                onChange={(e) => setForm((f) => ({ ...f, reveal: e.target.value }))}
                className="w-full rounded border px-3 py-2 text-sm bg-transparent"
                style={{ borderColor: "var(--tw-border)", color: "var(--tw-text)" }}
              />
            </div>
          </div>

          {status === "error" && <p className="text-sm text-red-600">{error}</p>}
          {status === "saved" && <p className="text-sm" style={{ color: "var(--tw-green)" }}>Saved.</p>}

          <button
            type="submit"
            disabled={status === "saving"}
            className="w-full rounded py-2.5 text-sm font-semibold"
            style={{ backgroundColor: "var(--tw-accent)", color: "var(--tw-surface)" }}
          >
            {status === "saving" ? "Saving…" : "Save puzzle"}
          </button>
        </form>

        <div className="space-y-6">
          <div className="rounded-lg border p-5" style={{ borderColor: "var(--tw-border)", backgroundColor: "var(--tw-surface)" }}>
            <h2 className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--tw-muted)" }}>
              How to author a good puzzle
            </h2>
            <ul className="text-sm space-y-2 list-disc pl-4" style={{ color: "var(--tw-text)" }}>
              <li>Pick a real voyage with a documented vessel, route, and rough date.</li>
              <li>Choose 3–5 goods where the goods themselves imply the geography.</li>
              <li>Set prices and currency that imply the economic role (source, entrepôt, consumer market, colonial extraction, or re-export).</li>
              <li>Make sure the goods-plus-currency combination only plausibly fits one era.</li>
            </ul>
          </div>

          <div className="rounded-lg border p-5" style={{ borderColor: "var(--tw-border)", backgroundColor: "var(--tw-surface)" }}>
            <h2 className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--tw-muted)" }}>
              Scheduled puzzles
            </h2>
            <ul className="text-sm space-y-1">
              {schedule.map((p) => (
                <li key={p.run_date}>
                  <button
                    type="button"
                    onClick={() => loadForEdit(p.run_date)}
                    className="underline decoration-dotted text-left"
                    style={{ color: "var(--tw-text)" }}
                  >
                    {p.run_date} — {p.ship_name}
                  </button>
                </li>
              ))}
              {schedule.length === 0 && <li style={{ color: "var(--tw-muted)" }}>Nothing scheduled yet.</li>}
            </ul>
          </div>

          <form
            onSubmit={handleAddPort}
            className="rounded-lg border p-5 space-y-2"
            style={{ borderColor: "var(--tw-border)", backgroundColor: "var(--tw-surface)" }}
          >
            <h2 className="text-sm font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--tw-muted)" }}>
              Add a new port
            </h2>
            <input
              placeholder="id (slug, e.g. panama-city)"
              value={portForm.id}
              onChange={(e) => setPortForm((f) => ({ ...f, id: e.target.value }))}
              className="w-full rounded border px-2 py-1.5 text-sm bg-transparent"
              style={{ borderColor: "var(--tw-border)", color: "var(--tw-text)" }}
            />
            <input
              placeholder="Name"
              value={portForm.name}
              onChange={(e) => setPortForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full rounded border px-2 py-1.5 text-sm bg-transparent"
              style={{ borderColor: "var(--tw-border)", color: "var(--tw-text)" }}
            />
            <input
              placeholder="Region (ocean/sea/corridor)"
              value={portForm.region}
              onChange={(e) => setPortForm((f) => ({ ...f, region: e.target.value }))}
              className="w-full rounded border px-2 py-1.5 text-sm bg-transparent"
              style={{ borderColor: "var(--tw-border)", color: "var(--tw-text)" }}
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                placeholder="Latitude"
                value={portForm.lat}
                onChange={(e) => setPortForm((f) => ({ ...f, lat: e.target.value }))}
                className="rounded border px-2 py-1.5 text-sm bg-transparent"
                style={{ borderColor: "var(--tw-border)", color: "var(--tw-text)" }}
              />
              <input
                placeholder="Longitude"
                value={portForm.lon}
                onChange={(e) => setPortForm((f) => ({ ...f, lon: e.target.value }))}
                className="rounded border px-2 py-1.5 text-sm bg-transparent"
                style={{ borderColor: "var(--tw-border)", color: "var(--tw-text)" }}
              />
            </div>
            <button
              type="submit"
              className="w-full rounded py-1.5 text-sm font-medium"
              style={{ backgroundColor: "var(--tw-accent)", color: "var(--tw-surface)" }}
            >
              Add port
            </button>
            {portStatus === "saved" && <p className="text-xs" style={{ color: "var(--tw-green)" }}>Added.</p>}
            {portStatus === "error" && <p className="text-xs text-red-600">Failed to add port.</p>}
          </form>
        </div>
      </div>
    </TradewindsShell>
  );
}
