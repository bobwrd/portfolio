import { useReducer } from "react";
import { REGIME_KEYS, type RegimeKey, type DistLabData, type RegimeVector } from "./types";

export type Mode = "history" | "playground";

export interface LabState {
  mode: Mode;
  country: string;
  year: number;
  regime: Record<RegimeKey, number>;   // Playground slider values 0-1
  locked: Record<RegimeKey, boolean>;
}

export type LabAction =
  | { type: "setMode"; mode: Mode }
  | { type: "setCountry"; country: string }
  | { type: "setYear"; year: number }
  | { type: "setRegime"; key: RegimeKey; value: number }
  | { type: "toggleLock"; key: RegimeKey }
  | { type: "loadRegime"; regime: Record<RegimeKey, number> };

function reducer(s: LabState, a: LabAction): LabState {
  switch (a.type) {
    case "setMode": return { ...s, mode: a.mode };
    case "setCountry": return { ...s, country: a.country };
    case "setYear": return { ...s, year: a.year };
    case "setRegime":
      if (s.locked[a.key]) return s;
      return { ...s, regime: { ...s.regime, [a.key]: a.value } };
    case "toggleLock": return { ...s, locked: { ...s.locked, [a.key]: !s.locked[a.key] } };
    case "loadRegime": return { ...s, regime: a.regime };
    default: return s;
  }
}

const zeroLock = () => Object.fromEntries(REGIME_KEYS.map((k) => [k, false])) as Record<RegimeKey, boolean>;
const midRegime = () => Object.fromEntries(REGIME_KEYS.map((k) => [k, 0.5])) as Record<RegimeKey, number>;

export function useLabState(initialCountry: string, initialYear: number) {
  return useReducer(reducer, {
    mode: "history",
    country: initialCountry,
    year: initialYear,
    regime: midRegime(),
    locked: zeroLock(),
  });
}

// Pull a continuous regime vector (0-1 per key) out of a RegimeVector row,
// defaulting missing values to 0.5 so a slider always has a position.
export function regimeToValues(rv: RegimeVector | undefined): Record<RegimeKey, number> {
  const out = midRegime();
  if (!rv) return out;
  for (const k of REGIME_KEYS) {
    const v = rv.values[k];
    if (v != null && Number.isFinite(v)) out[k] = v;
  }
  return out;
}

export { REGIME_KEYS };
export type { DistLabData };
