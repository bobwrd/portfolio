// Run with: bun test src/pages/distlab/mapping.test.ts
import { describe, expect, it } from "bun:test";
import { resolve, DEFAULT_CONFIG, type ObservedPoint } from "./mapping";

const DIMS = 8;
function pt(country: string, year: number, coords: number[], outcomes: Record<string, number | null>): ObservedPoint {
  return { country, year, coords, outcomes };
}

// A small synthetic cloud where outcome = a known linear function of coord 0,
// so weighted estimates near a target are predictable. Dims 1-7 carry mild
// deterministic variance (like real regime data) so no axis is degenerate.
function linearCloud(): ObservedPoint[] {
  const cloud: ObservedPoint[] = [];
  for (let i = 0; i <= 10; i++) {
    const x = i / 10;
    const off = 0.45 + 0.1 * ((i % 5) / 4); // ~0.45..0.55
    const coords = [x, off, off, off, off, off, off, off];
    cloud.push(pt(`C${i}`, 2000 + i, coords, { gini: 20 + 40 * x }));
  }
  return cloud;
}

describe("resolve", () => {
  it("estimates near the local value when a close analogue exists", () => {
    const cloud = linearCloud();
    const target = [0.7, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5];
    const r = resolve(target, cloud, ["gini"], DEFAULT_CONFIG);
    // true value at x=0.7 is 20 + 28 = 48; kernel smoothing keeps it close.
    expect(r.estimates.gini).toBeGreaterThan(44);
    expect(r.estimates.gini).toBeLessThan(52);
    expect(r.extrapolating).toBe(false);
  });

  it("flags extrapolation when the target is far from every point", () => {
    const cloud = linearCloud(); // dims 1-7 sit near 0.5 with small spread
    const target = [0.5, 0.95, 0.95, 0.95, 0.95, 0.95, 0.95, 0.95]; // far on 7 axes
    const r = resolve(target, cloud, ["gini"], DEFAULT_CONFIG);
    expect(r.extrapolating).toBe(true);
    expect(r.nearestDistance).toBeGreaterThan(DEFAULT_CONFIG.nearGate);
  });

  it("ranks the closest episode as the top contributor", () => {
    const cloud = linearCloud();
    const target = [0.3, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5];
    const r = resolve(target, cloud, ["gini"], DEFAULT_CONFIG);
    expect(r.contributors[0].country).toBe("C3"); // x=0.3
    expect(r.contributors[0].weight).toBeGreaterThan(r.contributors[1].weight);
  });

  it("effective N never exceeds the number of points", () => {
    const cloud = linearCloud();
    const target = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5];
    const r = resolve(target, cloud, ["gini"], DEFAULT_CONFIG);
    expect(r.effectiveN).toBeLessThanOrEqual(cloud.length);
    expect(r.effectiveN).toBeGreaterThan(0);
  });

  it("skips outcomes that no point reports", () => {
    const cloud = linearCloud();
    const target = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5];
    const r = resolve(target, cloud, ["missing"], DEFAULT_CONFIG);
    expect(r.estimates.missing).toBeNull();
  });

  it("handles an empty cloud without throwing", () => {
    const r = resolve(new Array(DIMS).fill(0.5), [], ["gini"]);
    expect(r.extrapolating).toBe(true);
    expect(r.estimates.gini).toBeNull();
  });
});
