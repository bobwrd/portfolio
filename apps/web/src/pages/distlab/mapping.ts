// The Playground mapping engine. Pure functions, no React, no DOM, so the logic
// can be unit-tested in isolation (see mapping.test.ts).
//
// Idea: every observed country-year is a point in the 8-dimensional regime space
// (the continuous 0-1 indices). For a target slider configuration we weight every
// observed point by a Gaussian kernel over its distance to the target, then take
// weighted means of the outcome metrics. We also report how many real episodes
// actually back the estimate, which ones, and whether the target sits in a region
// with no close analogue (extrapolation).
//
// Distance is plain weighted Euclidean on the raw 0-1 indices (NOT z-scored).
// The indices are already on a common 0-1 scale, and z-scoring would amplify an
// axis just because countries cluster on it, which is the opposite of what we
// want: a dimension everyone shares should not dominate "similarity". Max
// possible distance over 8 unit axes is sqrt(8) ≈ 2.83.
//
// Why kernel weighting and not plain kNN: kNN always returns k points even when
// none are near, which hides extrapolation. A kernel lets the weight fade to zero,
// so "no analogue" shows up honestly as a tiny effective neighbour count.

export interface ObservedPoint {
  country: string;
  year: number;
  coords: number[];                       // length = dims, the regime indices 0-1
  outcomes: Record<string, number | null>;
}

export interface MappingConfig {
  hScale: number;     // bandwidth = median(distance) * hScale
  minEffN: number;    // below this effective neighbour count => extrapolating
  nearGate: number;   // if nearest distance (z-units) exceeds this => extrapolating
  topK: number;       // how many contributing episodes to surface
  weights?: number[]; // optional per-axis weights (default all 1)
}

export const DEFAULT_CONFIG: MappingConfig = {
  hScale: 0.6,
  minEffN: 4,
  nearGate: 1.0,   // raw 0-1 index units; ~0.35/axis avg mismatch over 8 axes
  topK: 6,
};

export interface Contributor {
  country: string;
  year: number;
  weight: number;       // normalised 0-1 (share of total weight)
  distance: number;     // z-space distance to target
}

export interface MappingResult {
  estimates: Record<string, number | null>;
  effectiveN: number;            // (Σw)² / Σw²  — how many episodes really count
  nearestDistance: number;       // z-space distance to the closest observed point
  contributors: Contributor[];   // top-K by weight, descending
  extrapolating: boolean;
}

function median(xs: number[]): number {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

// Drop points whose coords contain a null/NaN (incomplete regime rows). The build
// script interpolates regime values, so this is a guard, not the common path.
function clean(points: ObservedPoint[], dims: number): ObservedPoint[] {
  return points.filter((p) => p.coords.length === dims && p.coords.every((x) => Number.isFinite(x)));
}

export function resolve(
  target: number[],
  cloud: ObservedPoint[],
  outcomeKeys: string[],
  cfg: MappingConfig = DEFAULT_CONFIG
): MappingResult {
  const dims = target.length;
  const points = clean(cloud, dims);

  if (!points.length) {
    return {
      estimates: Object.fromEntries(outcomeKeys.map((k) => [k, null])),
      effectiveN: 0, nearestDistance: Infinity, contributors: [], extrapolating: true,
    };
  }

  const w = cfg.weights ?? new Array(dims).fill(1);

  // Weighted Euclidean distance on the raw 0-1 indices.
  const dist = points.map((p) => {
    let s = 0;
    for (let d = 0; d < dims; d++) s += w[d] * (target[d] - p.coords[d]) ** 2;
    return Math.sqrt(s);
  });

  const h = (median(dist) * cfg.hScale) || 1e-6;
  const weights = dist.map((d) => Math.exp(-(d * d) / (2 * h * h)));
  const totalW = weights.reduce((a, b) => a + b, 0) || 1e-12;

  // Weighted mean per outcome over points that report it.
  const estimates: Record<string, number | null> = {};
  for (const key of outcomeKeys) {
    let num = 0, den = 0;
    points.forEach((p, i) => {
      const v = p.outcomes[key];
      if (v == null || !Number.isFinite(v)) return;
      num += weights[i] * v;
      den += weights[i];
    });
    estimates[key] = den > 0 ? num / den : null;
  }

  const sumW2 = weights.reduce((a, b) => a + b * b, 0) || 1e-12;
  const effectiveN = (totalW * totalW) / sumW2;
  const nearestDistance = Math.min(...dist);

  const contributors: Contributor[] = points
    .map((p, i) => ({ country: p.country, year: p.year, weight: weights[i] / totalW, distance: dist[i] }))
    .sort((a, b) => b.weight - a.weight)
    .slice(0, cfg.topK);

  const extrapolating = effectiveN < cfg.minEffN || nearestDistance > cfg.nearGate;

  return { estimates, effectiveN, nearestDistance, contributors, extrapolating };
}
