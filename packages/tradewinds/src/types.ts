export type FeedbackLevel = "green" | "yellow" | "grey";

export const MAX_GUESSES = 10;
export const REVEAL_GUESSES = [3, 5, 7] as const;

/**
 * Guess counts at which a hard hint unlocks, on top of the manifest reveals at
 * REVEAL_GUESSES. These give away part of the answer outright so that a game
 * always has a reachable endgame rather than coming down to a coin flip.
 */
export const HINT_GUESSES = { region: 4, era: 6, role: 8 } as const;

export const ECONOMIC_ROLES = [
  "Source producer",
  "Entrepôt / middleman",
  "End consumer market",
  "Colonial extractor",
  "Re-export hub",
] as const;

export type EconomicRole = (typeof ECONOMIC_ROLES)[number];

export interface Port {
  id: string;
  name: string;
  /** Ocean/sea basin or overland trade region, e.g. "Mediterranean", "Indian Ocean". */
  region: string;
  lat: number;
  lon: number;
}

/** A reveal-gated slot: null means visible from the start. */
export type RevealAt = null | 3 | 5 | 7;

export interface ManifestRow {
  good: string;
  quantity?: string;
  price?: string;
  note?: string;
  revealAt: RevealAt;
}

export interface Puzzle {
  runDate: string; // YYYY-MM-DD
  shipName: string;
  currencyName: string;
  manifest: ManifestRow[];
  originPortId: string;
  destinationPortId: string;
  decade: number;
  economicRole: EconomicRole;
  reveal: string;
}

export interface Guess {
  originPortId: string;
  destinationPortId: string;
  eraId: string;
  economicRole: EconomicRole;
}

/** Coarse distance buckets, so the share grid and copy can talk about "close" without a number. */
export type DistanceBand = "exact" | "very-close" | "close" | "distant" | "far";

/**
 * Feedback for a single endpoint. Origin and destination are graded
 * independently — a combined route verdict can't tell you *which* end you got
 * right, which was the main thing making the route unsolvable.
 */
export interface PortFeedback {
  level: FeedbackLevel;
  /** Compass bearing (0-360, 0 = north) from the guessed port toward the true port. */
  bearing: number;
  distanceKm: number;
  band: DistanceBand;
}

export interface RouteFeedback {
  /** Combined verdict across both endpoints, kept for the share grid. */
  level: FeedbackLevel;
  origin: PortFeedback;
  destination: PortFeedback;
  /** The guess names the right pair of ports but the wrong way round. */
  swapped: boolean;
}

export interface EraFeedback {
  level: FeedbackLevel;
  direction: "later" | "earlier" | null;
  /** How many era buckets away the truth is; 0 when correct. */
  distance: number;
}

export interface RoleFeedback {
  level: FeedbackLevel;
  nudge: "undervalued" | "overvalued" | null;
}

export interface Feedback {
  route: RouteFeedback;
  era: EraFeedback;
  role: RoleFeedback;
}
