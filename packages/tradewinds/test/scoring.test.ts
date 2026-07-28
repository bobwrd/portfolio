import { describe, expect, it } from "vitest";
import { PORTS } from "../src/ports.js";
import { gradeEra, gradeRole, gradeRoute, isWin, revealedManifestRows } from "../src/scoring.js";
import type { Feedback, ManifestRow } from "../src/types.js";

describe("gradeRoute", () => {
  it("is green when both endpoints match", () => {
    const fb = gradeRoute("manila", "acapulco", "manila", "acapulco", PORTS);
    expect(fb.level).toBe("green");
  });

  it("is yellow when one endpoint matches", () => {
    const fb = gradeRoute("manila", "lisbon", "manila", "acapulco", PORTS);
    expect(fb.level).toBe("yellow");
  });

  it("is yellow when the endpoints are swapped", () => {
    const fb = gradeRoute("acapulco", "manila", "manila", "acapulco", PORTS);
    expect(fb.level).toBe("yellow");
  });

  it("is yellow when neither endpoint matches but the region does", () => {
    // guangzhou is South China Sea, same region as manila (true origin)
    const fb = gradeRoute("guangzhou", "lisbon", "manila", "acapulco", PORTS);
    expect(fb.level).toBe("yellow");
  });

  it("is grey when nothing matches", () => {
    const fb = gradeRoute("lubeck", "novgorod", "manila", "acapulco", PORTS);
    expect(fb.level).toBe("grey");
  });

  it("always returns a defined arrow bearing", () => {
    const fb = gradeRoute("lubeck", "novgorod", "manila", "acapulco", PORTS);
    expect(fb.arrowBearing).toBeGreaterThanOrEqual(0);
    expect(fb.arrowBearing).toBeLessThan(360);
  });
});

describe("gradeEra", () => {
  it("is green on exact match", () => {
    expect(gradeEra(1590, 1590).level).toBe("green");
    expect(gradeEra(1590, 1590).direction).toBeNull();
  });

  it("is yellow within two decades", () => {
    const fb = gradeEra(1570, 1590);
    expect(fb.level).toBe("yellow");
    expect(fb.direction).toBe("later");
  });

  it("is grey further than two decades away", () => {
    const fb = gradeEra(1400, 1590);
    expect(fb.level).toBe("grey");
    expect(fb.direction).toBe("later");
  });

  it("points earlier when the guess overshoots", () => {
    const fb = gradeEra(1650, 1590);
    expect(fb.direction).toBe("earlier");
  });
});

describe("gradeRole", () => {
  it("is green on exact match", () => {
    expect(gradeRole("Source producer", "Source producer")).toEqual({
      level: "green",
      nudge: null,
    });
  });

  it("nudges overvalued when the guess implies a higher margin", () => {
    const fb = gradeRole("End consumer market", "Source producer");
    expect(fb.level).toBe("grey");
    expect(fb.nudge).toBe("overvalued");
  });

  it("nudges undervalued when the guess implies a lower margin", () => {
    const fb = gradeRole("Source producer", "End consumer market");
    expect(fb.level).toBe("grey");
    expect(fb.nudge).toBe("undervalued");
  });
});

describe("isWin", () => {
  it("requires all three axes green", () => {
    const win: Feedback = {
      route: { level: "green", arrowBearing: 0 },
      era: { level: "green", direction: null },
      role: { level: "green", nudge: null },
    };
    expect(isWin(win)).toBe(true);

    const notWin: Feedback = { ...win, era: { level: "yellow", direction: "later" } };
    expect(isWin(notWin)).toBe(false);
  });
});

describe("revealedManifestRows", () => {
  const manifest: ManifestRow[] = [
    { good: "always visible", revealAt: null },
    { good: "after 3", revealAt: 3 },
    { good: "after 5", revealAt: 5 },
    { good: "after 7", revealAt: 7 },
  ];

  it("shows only always-visible rows before any reveal threshold", () => {
    expect(revealedManifestRows(manifest, 0).map((r) => r.good)).toEqual(["always visible"]);
  });

  it("progressively reveals rows at guesses 3, 5, 7", () => {
    expect(revealedManifestRows(manifest, 3).map((r) => r.good)).toEqual([
      "always visible",
      "after 3",
    ]);
    expect(revealedManifestRows(manifest, 5).map((r) => r.good)).toEqual([
      "always visible",
      "after 3",
      "after 5",
    ]);
    expect(revealedManifestRows(manifest, 7).map((r) => r.good)).toEqual([
      "always visible",
      "after 3",
      "after 5",
      "after 7",
    ]);
  });
});
