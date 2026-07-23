export interface VerdictScores {
  LI: number;
  SE: number;
  ER: number;
  SF: number;
  PS: number;
}

export interface VerdictComputed {
  DP: number;
  DR: number;
  ABS: number;
  EDI: number;
  uncertainty_band: [number, number];
  tier: string;
  scenario_scores: {
    conservative: number;
    structural: number;
    balanced: number;
  };
}

export interface VerdictCase {
  case_id: number;
  title: string;
  date: string;
  decision_type: "court" | "regulatory" | "corporate";
  jurisdiction: string;
  summary: string;
  legal_mechanism: string;
  economic_consequence: string;
  scores: VerdictScores;
  computed: VerdictComputed;
  sources: string[];
  contributor: string;
  status: "draft" | "published";
}

export async function fetchCases(): Promise<VerdictCase[]> {
  const res = await fetch("/api/verdict/cases", { headers: { Accept: "application/json" } });
  if (!res.ok) return [];
  const data = await res.json();
  return data.cases ?? [];
}

export async function fetchCase(id: number): Promise<VerdictCase | null> {
  const res = await fetch(`/api/verdict/cases/${id}`, { headers: { Accept: "application/json" } });
  if (!res.ok) return null;
  const data = await res.json();
  return data.case ?? null;
}

export const TIER_COLORS: Record<string, string> = {
  Seismic: "var(--verdict-seismic)",
  Major: "var(--verdict-major)",
  Moderate: "var(--verdict-moderate)",
  Marginal: "var(--verdict-marginal)",
};

export const TIER_BG: Record<string, string> = {
  Seismic: "rgba(248,113,113,0.12)",
  Major: "rgba(251,146,60,0.12)",
  Moderate: "rgba(250,204,21,0.12)",
  Marginal: "rgba(148,163,184,0.10)",
};
