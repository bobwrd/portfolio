import { describe, expect, it } from "vitest";
import { buildShareText } from "../../src/tradewinds/lib/shareGrid";
import type { StoredGuess } from "../../src/tradewinds/lib/storage";

function port(level: "green" | "yellow" | "grey") {
  return level === "green"
    ? ({ level, bearing: 0, distanceKm: 0, band: "exact" } as const)
    : ({ level, bearing: 90, distanceKm: 2000, band: "distant" } as const);
}

function guess(route: "green" | "yellow" | "grey", era: "green" | "yellow" | "grey", role: "green" | "grey"): StoredGuess {
  return {
    guess: {
      originPortId: "a",
      destinationPortId: "b",
      eraId: "age-of-discovery",
      economicRole: "Source producer",
    },
    feedback: {
      route: { level: route, origin: port(route), destination: port(route), swapped: false },
      era: { level: era, direction: era === "green" ? null : "later", distance: era === "green" ? 0 : 1 },
      role: { level: role, nudge: role === "green" ? null : "overvalued" },
    },
  };
}

describe("buildShareText", () => {
  it("matches the brief's exact format on a win", () => {
    const history = [
      guess("yellow", "green", "grey"),
      guess("green", "yellow", "green"),
      guess("green", "green", "grey"),
      guess("green", "green", "green"),
    ];
    expect(buildShareText("2026-07-28", history, "won")).toBe(
      [
        "Tradewinds 2026-07-28  4/10",
        "🟨🟩⬜",
        "🟩🟨🟩",
        "🟩🟩⬜",
        "🟩🟩🟩",
        "🧭📅💰",
      ].join("\n"),
    );
  });

  it("shows X/10 on a loss", () => {
    const history = [guess("grey", "grey", "grey")];
    const text = buildShareText("2026-07-28", history, "lost");
    expect(text.startsWith("Tradewinds 2026-07-28  X/10")).toBe(true);
  });
});
