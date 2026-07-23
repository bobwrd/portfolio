#!/usr/bin/env bun
/**
 * compute_verdict_scores.ts
 * Recomputes all published verdict cases. Drafts are excluded from normalisation.
 * Run: bun scripts/compute_verdict_scores.ts
 */

import { join } from "node:path";

const CASES_PATH = join(import.meta.dir, "../content/verdict/verdict_cases.json");

interface RawScores {
  LI: number;
  SE: number;
  ER: number;
  SF: number;
  PS: number;
}

interface ComputedScores {
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

interface VerdictCase {
  case_id: number;
  title: string;
  date: string;
  decision_type: string;
  jurisdiction: string;
  summary: string;
  legal_mechanism: string;
  economic_consequence: string;
  scores: RawScores;
  computed: ComputedScores;
  sources: string[];
  contributor: string;
  status: "draft" | "published";
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function computeDP(s: RawScores): number {
  return (s.LI * 0.55) + (s.SE * 0.45);
}

function computeDR(s: RawScores): number {
  return (s.ER * 0.40) + (s.SF * 0.35) + (s.PS * 0.25);
}

function computeABS(dp: number, dr: number): number {
  return Math.sqrt(dp * dr);
}

// Conservative: ER weight ×2 in DR, SF halved
function computeABS_conservative(s: RawScores): number {
  const dp = computeDP(s);
  const dr = (s.ER * 0.80) + (s.SF * 0.175) + (s.PS * 0.25);
  return Math.sqrt(dp * dr);
}

// Structural: LI and SE weights ×2 in DP, PS halved in DR
function computeABS_structural(s: RawScores): number {
  const dp = (s.LI * 1.10) + (s.SE * 0.90);
  const dr = (s.ER * 0.40) + (s.SF * 0.35) + (s.PS * 0.125);
  return Math.sqrt(dp * dr);
}

// Balanced: equal 0.20 weight across all five factors
function computeABS_balanced(s: RawScores): number {
  const dp = (s.LI * 0.20) + (s.SE * 0.20);
  const dr = (s.ER * 0.20) + (s.SF * 0.20) + (s.PS * 0.20);
  return Math.sqrt(dp * dr);
}

function computeEDI(abs: number, mean: number, stddev: number): number {
  if (stddev === 0) return 5.0;
  const z = (abs - mean) / stddev;
  return clamp(5 + 2 * z, 1.0, 10.0);
}

function tierFromEDI(edi: number): string {
  if (edi >= 8.0) return "Seismic";
  if (edi >= 6.0) return "Major";
  if (edi >= 4.0) return "Moderate";
  return "Marginal";
}

function mean(arr: number[]): number {
  return arr.reduce((s, v) => s + v, 0) / arr.length;
}

function stddev(arr: number[], m: number): number {
  if (arr.length <= 1) return 0;
  const variance = arr.reduce((s, v) => s + (v - m) ** 2, 0) / arr.length;
  return Math.sqrt(variance);
}

async function main() {
  const raw = await Bun.file(CASES_PATH).text();
  const cases: VerdictCase[] = JSON.parse(raw);

  const published = cases.filter((c) => c.status === "published");

  if (published.length === 0) {
    console.log("No published cases — nothing to compute.");
    return;
  }

  // Compute base ABS for all published cases
  const absValues = published.map((c) => computeABS(computeDP(c.scores), computeDR(c.scores)));
  const meanABS = mean(absValues);
  const stdABS = stddev(absValues, meanABS);

  console.log(`Processing ${published.length} published case(s)`);
  console.log(`  mean_ABS = ${round2(meanABS)}, stddev_ABS = ${round2(stdABS)}`);
  if (stdABS === 0) {
    console.log("  Note: stddev = 0 (single case or identical ABS values). EDI defaults to 5.0 for all.");
  }

  for (const c of cases) {
    if (c.status !== "published") continue;

    const dp = round2(computeDP(c.scores));
    const dr = round2(computeDR(c.scores));
    const abs = computeABS(dp, dr);
    const edi = round2(computeEDI(abs, meanABS, stdABS));

    // Scenario ABS values
    const abs_c = computeABS_conservative(c.scores);
    const abs_s = computeABS_structural(c.scores);
    const abs_b = computeABS_balanced(c.scores);

    const edi_c = round2(computeEDI(abs_c, meanABS, stdABS));
    const edi_s = round2(computeEDI(abs_s, meanABS, stdABS));
    const edi_b = round2(computeEDI(abs_b, meanABS, stdABS));

    const band: [number, number] = [
      round2(Math.min(edi_c, edi_s, edi_b)),
      round2(Math.max(edi_c, edi_s, edi_b)),
    ];

    c.computed = {
      DP: dp,
      DR: dr,
      ABS: round2(abs),
      EDI: edi,
      uncertainty_band: band,
      tier: tierFromEDI(edi),
      scenario_scores: {
        conservative: edi_c,
        structural: edi_s,
        balanced: edi_b,
      },
    };

    console.log(`  [${c.case_id}] ${c.title}`);
    console.log(`       DP=${dp}, DR=${dr}, ABS=${round2(abs)}, EDI=${edi} (${c.computed.tier})`);
    console.log(`       band=[${band[0]}, ${band[1]}]  scenarios: C=${edi_c} S=${edi_s} B=${edi_b}`);
  }

  await Bun.write(CASES_PATH, JSON.stringify(cases, null, 2));
  console.log(`\nWrote updated cases to ${CASES_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
