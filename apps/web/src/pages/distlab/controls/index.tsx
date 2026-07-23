import { useState } from "react";
import { Play, Pause, ChevronDown } from "lucide-react";
import { Slider, SourceTag } from "../shared";
import { REGIME_KEYS, REGIME_META, type RegimeKey, type RegimeVector } from "../types";
import type { MappingResult } from "../mapping";

const LEVEL_LABELS = ["very low", "low", "mid", "high", "very high"];

// --- Country picker --------------------------------------------------------
export function CountryPicker({
  countries, names, value, onChange,
}: { countries: string[]; names: Record<string, string>; value: string; onChange: (c: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {countries.map((c) => {
        const active = c === value;
        return (
          <button
            key={c}
            onClick={() => onChange(c)}
            className="px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-150"
            style={{
              backgroundColor: active ? "var(--dl-accent)" : "var(--dl-surface-2)",
              color: active ? "#1a1205" : "var(--dl-muted)",
            }}
          >
            {names[c] || c}
          </button>
        );
      })}
    </div>
  );
}

// --- Mode toggle -----------------------------------------------------------
export function ModeToggle({ mode, onChange }: { mode: "history" | "playground"; onChange: (m: "history" | "playground") => void }) {
  return (
    <div className="inline-flex rounded-lg p-0.5 border" style={{ borderColor: "var(--dl-border)", backgroundColor: "var(--dl-surface)" }}>
      {(["history", "playground"] as const).map((m) => (
        <button
          key={m}
          onClick={() => onChange(m)}
          className="px-4 py-1.5 rounded-md text-xs font-semibold capitalize transition-colors duration-150"
          style={{ backgroundColor: mode === m ? "var(--dl-accent)" : "transparent", color: mode === m ? "#1a1205" : "var(--dl-muted)" }}
        >
          {m}
        </button>
      ))}
    </div>
  );
}

// --- Level dots (History display) ------------------------------------------
function LevelDots({ level, interp }: { level: number | null; interp?: boolean }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => {
        const on = level != null && i <= level;
        return (
          <span
            key={i}
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: on && !interp ? "var(--dl-accent)" : "transparent",
              border: `1px solid ${on ? "var(--dl-accent)" : "var(--dl-border)"}`,
              opacity: on ? 1 : 0.5,
            }}
          />
        );
      })}
    </div>
  );
}

// --- Regime bar ------------------------------------------------------------
export function RegimeBar({
  mode, row, values, locked, onChange, onToggleLock,
}: {
  mode: "history" | "playground";
  row?: RegimeVector;
  values: Record<RegimeKey, number>;
  locked: Record<RegimeKey, boolean>;
  onChange: (k: RegimeKey, v: number) => void;
  onToggleLock: (k: RegimeKey) => void;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-x-4 gap-y-3">
      {REGIME_KEYS.map((k) => {
        const meta = REGIME_META[k];
        if (mode === "playground") {
          return (
            <Slider
              key={k}
              label={meta.label}
              value={values[k]}
              level={Math.round(values[k] * 4) + 1}
              levelLabels={LEVEL_LABELS}
              locked={locked[k]}
              onToggleLock={() => onToggleLock(k)}
              onChange={(v) => onChange(k, v)}
            />
          );
        }
        const level = row?.levels[k] ?? null;
        const interp = row?.meta[k]?.interp;
        const raw = row?.raw[k];
        const rawStr = raw ? Object.entries(raw).filter(([, v]) => v != null).map(([kk, v]) => `${kk}: ${v}`).join(", ") : "";
        return (
          <div key={k} title={`${meta.blurb}${rawStr ? ` (${rawStr})` : ""}${interp ? " · interpolated" : ""}`}>
            <div className="text-[0.65rem] font-medium mb-1" style={{ color: "var(--dl-text)" }}>{meta.label}</div>
            <LevelDots level={level} interp={interp} />
            <div className="mt-1 text-[0.55rem] font-mono" style={{ color: "var(--dl-muted)" }}>
              {level != null ? LEVEL_LABELS[Math.min(4, level - 1)] : "no data"}{interp ? " · est." : ""}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// --- Year scrubber (History) ----------------------------------------------
export function YearScrubber({ year, min, max, onChange }: { year: number; min: number; max: number; onChange: (y: number) => void }) {
  const [playing, setPlaying] = useState(false);

  // Advance roughly one year every 700ms while playing.
  useInterval(() => {
    if (!playing) return;
    if (year >= max) { setPlaying(false); return; }
    onChange(year + 1);
  }, playing ? 700 : null);

  return (
    <div className="flex items-center gap-3">
      <button onClick={() => setPlaying((p) => !p)} className="p-2 rounded-md shrink-0" style={{ backgroundColor: "var(--dl-surface-2)", color: "var(--dl-accent)" }} title={playing ? "Pause" : "Play through years"}>
        {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </button>
      <span className="font-mono text-lg font-bold tabular-nums shrink-0" style={{ color: "var(--dl-accent)" }}>{year}</span>
      <input type="range" min={min} max={max} step={1} value={year} onChange={(e) => onChange(Number(e.target.value))} className="dl-range flex-1" />
      <span className="font-mono text-[0.6rem] shrink-0" style={{ color: "var(--dl-muted)" }}>{min}–{max}</span>
    </div>
  );
}

// --- Evidence strip (Playground) ------------------------------------------
export function EvidenceStrip({ result, names }: { result: MappingResult; names: Record<string, string> }) {
  const top = result.contributors.slice(0, 3).map((c) => `${names[c.country] || c.country} ${c.year}`).join(", ");
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {result.extrapolating ? (
        <span className="text-xs font-medium px-2 py-1 rounded" style={{ backgroundColor: "var(--dl-warn)", color: "#1a1205" }}>
          No close real-world analogue — estimates are extrapolated
        </span>
      ) : (
        <span className="text-xs" style={{ color: "var(--dl-muted)" }}>
          Based on ≈<b style={{ color: "var(--dl-text)" }}>{result.effectiveN.toFixed(0)}</b> similar episodes
          {top && <>, mostly <b style={{ color: "var(--dl-text)" }}>{top}</b></>}
        </span>
      )}
    </div>
  );
}

// --- Evidence drawer (Playground) -----------------------------------------
export function EvidenceDrawer({
  result, names, outcomeOf,
}: {
  result: MappingResult;
  names: Record<string, string>;
  outcomeOf: (country: string, year: number) => { gini: number | null; gdp: number | null; well: number | null };
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-lg border" style={{ borderColor: "var(--dl-border)" }}>
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between px-3 py-2 text-[0.7rem] font-mono uppercase tracking-wider" style={{ color: "var(--dl-muted)" }} aria-expanded={open}>
        <span>Evidence — {result.contributors.length} contributing episodes</span>
        <ChevronDown className="h-4 w-4 transition-transform" style={{ transform: open ? "rotate(180deg)" : "none" }} />
      </button>
      {open && (
        <div className="px-3 pb-3 pt-1 border-t space-y-1" style={{ borderColor: "var(--dl-border)" }}>
          {result.contributors.map((c) => {
            const o = outcomeOf(c.country, c.year);
            return (
              <div key={`${c.country}-${c.year}`} className="flex items-center justify-between text-[0.7rem] gap-2 py-1">
                <span style={{ color: "var(--dl-text)" }}>{names[c.country] || c.country} <span style={{ color: "var(--dl-muted)" }}>{c.year}</span></span>
                <span className="font-mono tabular-nums" style={{ color: "var(--dl-muted)" }}>
                  w {(c.weight * 100).toFixed(0)}% · Gini {o.gini?.toFixed(0) ?? "–"} · HDI {o.well?.toFixed(2) ?? "–"}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// small interval hook
import { useEffect, useRef } from "react";
function useInterval(cb: () => void, delay: number | null) {
  const ref = useRef(cb);
  ref.current = cb;
  useEffect(() => {
    if (delay == null) return;
    const id = setInterval(() => ref.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}
