export type FeedbackLevel = "green" | "yellow" | "grey";

export const MAX_GUESSES = 10;
export const REVEAL_GUESSES = [3, 5, 7] as const;

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
  decade: number;
  economicRole: EconomicRole;
}

export interface RouteFeedback {
  level: FeedbackLevel;
  /** Compass bearing (0-360, 0 = north) from the guessed route's midpoint toward the true route's midpoint. */
  arrowBearing: number;
}

export interface EraFeedback {
  level: FeedbackLevel;
  direction: "later" | "earlier" | null;
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
