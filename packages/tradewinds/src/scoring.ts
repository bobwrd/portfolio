import { eraForDecade, eraIndex } from "./eras.js";
import { bearing, distanceKm } from "./geo.js";
import { findPort } from "./ports.js";
import { roleMarginIndex } from "./roles.js";
import {
  HINT_GUESSES,
  type DistanceBand,
  type EconomicRole,
  type EraFeedback,
  type Feedback,
  type ManifestRow,
  type Port,
  type PortFeedback,
  type Puzzle,
  type RevealAt,
  type RoleFeedback,
  type RouteFeedback,
} from "./types.js";

/** Upper bound (km, exclusive) for each band below "far". */
const DISTANCE_BANDS: [DistanceBand, number][] = [
  ["very-close", 500],
  ["close", 1500],
  ["distant", 4000],
];

export function distanceBand(km: number): DistanceBand {
  if (km === 0) return "exact";
  for (const [band, limit] of DISTANCE_BANDS) {
    if (km < limit) return band;
  }
  return "far";
}

/**
 * Grades one endpoint: green on an exact port match, yellow when the guess is
 * in the true port's region, grey otherwise. Bearing and distance are always
 * populated so a grey guess still triangulates.
 */
export function gradePort(guessId: string, trueId: string, ports: Port[]): PortFeedback {
  const guess = findPort(ports, guessId);
  const truth = findPort(ports, trueId);

  if (!guess || !truth) {
    return { level: "grey", bearing: 0, distanceKm: 0, band: "far" };
  }

  const km = distanceKm(guess.lat, guess.lon, truth.lat, truth.lon);
  const level: PortFeedback["level"] =
    guessId === trueId ? "green" : guess.region === truth.region ? "yellow" : "grey";

  return {
    level,
    bearing: bearing(guess.lat, guess.lon, truth.lat, truth.lon),
    distanceKm: km,
    band: guessId === trueId ? "exact" : distanceBand(km),
  };
}

export function gradeRoute(
  guessOriginId: string,
  guessDestId: string,
  trueOriginId: string,
  trueDestId: string,
  ports: Port[],
): RouteFeedback {
  const origin = gradePort(guessOriginId, trueOriginId, ports);
  const destination = gradePort(guessDestId, trueDestId, ports);
  const swapped = guessOriginId === trueDestId && guessDestId === trueOriginId;

  let level: RouteFeedback["level"];
  if (origin.level === "green" && destination.level === "green") {
    level = "green";
  } else if (swapped || origin.level !== "grey" || destination.level !== "grey") {
    level = "yellow";
  } else {
    level = "grey";
  }

  return { level, origin, destination, swapped };
}

/** Sentinel for a guess naming an era that no longer exists (e.g. stale saved progress). */
const ERA_DISTANCE_UNKNOWN = -1;

/** Compares the guessed era against the era containing the puzzle's true decade. */
export function gradeEra(guessEraId: string, trueDecade: number): EraFeedback {
  const trueEra = eraForDecade(trueDecade);
  const guessIndex = eraIndex(guessEraId);
  const trueIdx = eraIndex(trueEra.id);

  if (guessIndex === -1) {
    return { level: "grey", direction: null, distance: ERA_DISTANCE_UNKNOWN };
  }

  const distance = Math.abs(guessIndex - trueIdx);
  const level: EraFeedback["level"] = distance === 0 ? "green" : distance === 1 ? "yellow" : "grey";
  const direction = distance === 0 ? null : trueIdx > guessIndex ? "later" : "earlier";

  return { level, direction, distance };
}

export function gradeRole(guessRole: EconomicRole, trueRole: EconomicRole): RoleFeedback {
  if (guessRole === trueRole) return { level: "green", nudge: null };

  const guessIndex = roleMarginIndex(guessRole);
  const trueIndex = roleMarginIndex(trueRole);
  const nudge = guessIndex < trueIndex ? "undervalued" : "overvalued";

  return { level: "grey", nudge };
}

export function isWin(feedback: Feedback): boolean {
  return (
    feedback.route.level === "green" &&
    feedback.era.level === "green" &&
    feedback.role.level === "green"
  );
}

export function revealedManifestRows(manifest: ManifestRow[], guessCount: number): ManifestRow[] {
  return manifest.filter((row) => isRevealed(row.revealAt, guessCount));
}

function isRevealed(revealAt: RevealAt, guessCount: number): boolean {
  return revealAt === null || revealAt <= guessCount;
}

// ---------------------------------------------------------------------------
// Escalating hints
// ---------------------------------------------------------------------------

export interface Hint {
  id: "region" | "era" | "role";
  label: string;
  text: string;
  revealAt: number;
}

/**
 * Hints are derived from the puzzle rather than authored, so existing puzzles
 * gain them with no schema or content change.
 */
export function allHints(puzzle: Puzzle, ports: Port[]): Hint[] {
  const origin = findPort(ports, puzzle.originPortId);
  const era = eraForDecade(puzzle.decade);

  return [
    {
      id: "region",
      label: "Origin region",
      text: origin ? `The voyage sets out from the ${origin.region}.` : "Origin region unavailable.",
      revealAt: HINT_GUESSES.region,
    },
    {
      id: "era",
      label: "Era",
      text: `The voyage belongs to the ${era.label} (${era.range}).`,
      revealAt: HINT_GUESSES.era,
    },
    {
      id: "role",
      label: "Economic role",
      text: `This leg reads as: ${puzzle.economicRole}.`,
      revealAt: HINT_GUESSES.role,
    },
  ];
}

export function revealedHints(puzzle: Puzzle, ports: Port[], guessCount: number): Hint[] {
  return allHints(puzzle, ports).filter((h) => guessCount >= h.revealAt);
}
