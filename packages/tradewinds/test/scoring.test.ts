import { describe, expect, it } from "vitest";
import { PORTS } from "../src/ports.js";
import { ERAS, eraForDecade } from "../src/eras.js";
import {
  allHints,
  distanceBand,
  gradeEra,
  gradePort,
  gradeRole,
  gradeRoute,
  isWin,
  revealedHints,
  revealedManifestRows,
} from "../src/scoring.js";
import type { Feedback, ManifestRow, Puzzle } from "../src/types.js";

describe("gradePort", () => {
  it("is green and exact on the same port", () => {
    const fb = gradePort("manila", "manila", PORTS);
    expect(fb.level).toBe("green");
    expect(fb.band).toBe("exact");
    expect(fb.distanceKm).toBe(0);
  });

  it("is yellow for a different port in the same region", () => {
    // guangzhou and manila are both South China Sea
    expect(gradePort("guangzhou", "manila", PORTS).level).toBe("yellow");
  });

  it("is grey for a different region", () => {
    expect(gradePort("lisbon", "manila", PORTS).level).toBe("grey");
  });

  it("reports a usable distance and bearing on a miss", () => {
    const fb = gradePort("guangzhou", "manila", PORTS);
    // Guangzhou to Manila is roughly 1,100 km to the southeast.
    expect(fb.distanceKm).toBeGreaterThan(900);
    expect(fb.distanceKm).toBeLessThan(1400);
    expect(fb.bearing).toBeGreaterThan(90);
    expect(fb.bearing).toBeLessThan(180);
  });
});

describe("distanceBand", () => {
  it("buckets by great-circle distance", () => {
    expect(distanceBand(0)).toBe("exact");
    expect(distanceBand(200)).toBe("very-close");
    expect(distanceBand(1200)).toBe("close");
    expect(distanceBand(3000)).toBe("distant");
    expect(distanceBand(9000)).toBe("far");
  });
});

describe("gradeRoute", () => {
  it("is green only when both endpoints match", () => {
    expect(gradeRoute("manila", "acapulco", "manila", "acapulco", PORTS).level).toBe("green");
  });

  it("grades each endpoint independently", () => {
    const fb = gradeRoute("manila", "lisbon", "manila", "acapulco", PORTS);
    expect(fb.origin.level).toBe("green");
    expect(fb.destination.level).toBe("grey");
    expect(fb.level).toBe("yellow");
  });

  it("flags a swapped pair", () => {
    const fb = gradeRoute("acapulco", "manila", "manila", "acapulco", PORTS);
    expect(fb.swapped).toBe(true);
    expect(fb.level).toBe("yellow");
  });

  it("does not flag swapped when the ports are simply wrong", () => {
    expect(gradeRoute("lubeck", "novgorod", "manila", "acapulco", PORTS).swapped).toBe(false);
  });

  it("is yellow when neither endpoint matches but a region does", () => {
    const fb = gradeRoute("guangzhou", "lisbon", "manila", "acapulco", PORTS);
    expect(fb.level).toBe("yellow");
  });

  it("is grey when nothing matches", () => {
    expect(gradeRoute("lubeck", "novgorod", "manila", "acapulco", PORTS).level).toBe("grey");
  });
});

describe("eraForDecade", () => {
  it("tiles the full decade range with no gaps", () => {
    for (let d = -300; d <= 2020; d += 10) {
      expect(eraForDecade(d)).toBeDefined();
    }
  });

  it("places decades in the expected era", () => {
    expect(eraForDecade(1590).id).toBe("age-of-discovery");
    expect(eraForDecade(1600).id).toBe("company-era");
    expect(eraForDecade(-100).id).toBe("classical");
    expect(eraForDecade(2020).id).toBe("modern");
  });
});

describe("gradeEra", () => {
  it("is green when the guessed era contains the true decade", () => {
    const fb = gradeEra("age-of-discovery", 1590);
    expect(fb.level).toBe("green");
    expect(fb.direction).toBeNull();
    expect(fb.distance).toBe(0);
  });

  it("is yellow one era away, and points later", () => {
    const fb = gradeEra("late-medieval", 1590);
    expect(fb.level).toBe("yellow");
    expect(fb.direction).toBe("later");
    expect(fb.distance).toBe(1);
  });

  it("is grey more than one era away", () => {
    const fb = gradeEra("classical", 1590);
    expect(fb.level).toBe("grey");
    expect(fb.direction).toBe("later");
    expect(fb.distance).toBeGreaterThan(1);
  });

  it("points earlier when the guess overshoots", () => {
    expect(gradeEra("modern", 1590).direction).toBe("earlier");
  });

  it("degrades safely on an unknown era id", () => {
    const fb = gradeEra("not-an-era", 1590);
    expect(fb.level).toBe("grey");
    expect(fb.distance).toBe(-1);
  });

  it("keeps the guess space small enough to search", () => {
    expect(ERAS.length).toBeLessThanOrEqual(12);
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
  const greenPort = { level: "green", bearing: 0, distanceKm: 0, band: "exact" } as const;

  it("requires every axis green", () => {
    const win: Feedback = {
      route: { level: "green", origin: greenPort, destination: greenPort, swapped: false },
      era: { level: "green", direction: null, distance: 0 },
      role: { level: "green", nudge: null },
    };
    expect(isWin(win)).toBe(true);

    const notWin: Feedback = {
      ...win,
      era: { level: "yellow", direction: "later", distance: 1 },
    };
    expect(isWin(notWin)).toBe(false);
  });

  it("is not a win when only one endpoint is right", () => {
    const feedback: Feedback = {
      route: {
        level: "yellow",
        origin: greenPort,
        destination: { level: "grey", bearing: 90, distanceKm: 5000, band: "far" },
        swapped: false,
      },
      era: { level: "green", direction: null, distance: 0 },
      role: { level: "green", nudge: null },
    };
    expect(isWin(feedback)).toBe(false);
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

describe("hints", () => {
  const puzzle: Puzzle = {
    runDate: "2026-08-01",
    shipName: "Nuestra Señora",
    currencyName: "reales",
    manifest: [],
    originPortId: "manila",
    destinationPortId: "acapulco",
    decade: 1590,
    economicRole: "Entrepôt / middleman",
    reveal: "",
  };

  it("derives all three hints from the puzzle itself", () => {
    const hints = allHints(puzzle, PORTS);
    expect(hints.map((h) => h.id)).toEqual(["region", "era", "role"]);
    expect(hints[0].text).toContain("South China Sea");
    expect(hints[1].text).toContain("Age of Discovery");
    expect(hints[2].text).toContain("Entrepôt / middleman");
  });

  it("unlocks progressively at guesses 4, 6, and 8", () => {
    expect(revealedHints(puzzle, PORTS, 3)).toHaveLength(0);
    expect(revealedHints(puzzle, PORTS, 4).map((h) => h.id)).toEqual(["region"]);
    expect(revealedHints(puzzle, PORTS, 6).map((h) => h.id)).toEqual(["region", "era"]);
    expect(revealedHints(puzzle, PORTS, 8).map((h) => h.id)).toEqual(["region", "era", "role"]);
  });
});
