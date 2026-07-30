import { MAX_DECADE, MIN_DECADE } from "./decade.js";

/**
 * Players guess a named era, not a raw decade. Puzzles still store an exact
 * decade as the answer — the era is derived from it — so authoring and the D1
 * schema are unchanged, but the guess space drops from 233 decade buckets to
 * 10 eras, which is what makes the game solvable inside 10 guesses.
 *
 * `start` is inclusive, `end` exclusive, and the list must tile
 * [MIN_DECADE, MAX_DECADE] with no gaps — `eraForDecade` relies on it.
 */
export interface Era {
  id: string;
  label: string;
  /** Inclusive first decade in the era. */
  start: number;
  /** Exclusive last decade — equal to the next era's `start`. */
  end: number;
  /** Human-readable span shown beside the label in the picker. */
  range: string;
}

export const ERAS: Era[] = [
  { id: "classical", label: "Classical Antiquity", start: MIN_DECADE, end: 300, range: "300 BCE – 300 CE" },
  { id: "late-antiquity", label: "Late Antiquity", start: 300, end: 700, range: "300 – 700" },
  { id: "early-medieval", label: "Early Medieval", start: 700, end: 1000, range: "700 – 1000" },
  { id: "high-medieval", label: "High Medieval", start: 1000, end: 1300, range: "1000 – 1300" },
  { id: "late-medieval", label: "Late Medieval", start: 1300, end: 1450, range: "1300 – 1450" },
  { id: "age-of-discovery", label: "Age of Discovery", start: 1450, end: 1600, range: "1450 – 1600" },
  { id: "company-era", label: "Company Era", start: 1600, end: 1750, range: "1600 – 1750" },
  { id: "industrial", label: "Industrial Age", start: 1750, end: 1870, range: "1750 – 1870" },
  { id: "steam-empire", label: "Steam & Empire", start: 1870, end: 1945, range: "1870 – 1945" },
  { id: "modern", label: "Modern Era", start: 1945, end: MAX_DECADE + 10, range: "1945 – present" },
];

export function findEra(id: string): Era | undefined {
  return ERAS.find((e) => e.id === id);
}

/** The era containing `decade`, clamping decades outside the covered span to the end eras. */
export function eraForDecade(decade: number): Era {
  if (decade < ERAS[0].start) return ERAS[0];
  const era = ERAS.find((e) => decade >= e.start && decade < e.end);
  return era ?? ERAS[ERAS.length - 1];
}

/** Position in `ERAS`, used to measure how many buckets a guess is off by. */
export function eraIndex(id: string): number {
  return ERAS.findIndex((e) => e.id === id);
}
