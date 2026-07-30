import { describe, expect, it } from "vitest";
import type { EconomicRole, FeedbackLevel } from "@portfolio/tradewinds";
import { deriveLocks, lockedCount, NO_LOCKS } from "../../src/tradewinds/lib/locks";
import type { StoredGuess } from "../../src/tradewinds/lib/storage";

function port(level: FeedbackLevel) {
  return level === "green"
    ? ({ level, bearing: 0, distanceKm: 0, band: "exact" } as const)
    : ({ level, bearing: 90, distanceKm: 2000, band: "distant" } as const);
}

function guess(opts: {
  originPortId: string;
  destinationPortId: string;
  eraId: string;
  economicRole: EconomicRole;
  origin: FeedbackLevel;
  destination: FeedbackLevel;
  era: FeedbackLevel;
  role: FeedbackLevel;
}): StoredGuess {
  return {
    guess: {
      originPortId: opts.originPortId,
      destinationPortId: opts.destinationPortId,
      eraId: opts.eraId,
      economicRole: opts.economicRole,
    },
    feedback: {
      route: {
        level: "yellow",
        origin: port(opts.origin),
        destination: port(opts.destination),
        swapped: false,
      },
      era: { level: opts.era, direction: opts.era === "green" ? null : "later", distance: 1 },
      role: { level: opts.role, nudge: opts.role === "green" ? null : "overvalued" },
    },
  };
}

describe("deriveLocks", () => {
  it("locks nothing for an empty history", () => {
    expect(deriveLocks([])).toEqual(NO_LOCKS);
  });

  it("locks each component the first time it goes green", () => {
    const locks = deriveLocks([
      guess({
        originPortId: "manila",
        destinationPortId: "lisbon",
        eraId: "late-medieval",
        economicRole: "Source producer",
        origin: "green",
        destination: "grey",
        era: "yellow",
        role: "grey",
      }),
    ]);
    expect(locks.originPortId).toBe("manila");
    expect(locks.destinationPortId).toBeNull();
    expect(locks.eraId).toBeNull();
    expect(locks.economicRole).toBeNull();
  });

  it("accumulates locks across guesses", () => {
    const locks = deriveLocks([
      guess({
        originPortId: "manila",
        destinationPortId: "lisbon",
        eraId: "late-medieval",
        economicRole: "Source producer",
        origin: "green",
        destination: "grey",
        era: "yellow",
        role: "grey",
      }),
      guess({
        originPortId: "manila",
        destinationPortId: "acapulco",
        eraId: "age-of-discovery",
        economicRole: "Entrepôt / middleman",
        origin: "green",
        destination: "green",
        era: "green",
        role: "green",
      }),
    ]);
    expect(locks).toEqual({
      originPortId: "manila",
      destinationPortId: "acapulco",
      eraId: "age-of-discovery",
      economicRole: "Entrepôt / middleman",
    });
    expect(lockedCount(locks)).toBe(4);
  });

  it("never unlocks a component once it has gone green", () => {
    const solved = guess({
      originPortId: "manila",
      destinationPortId: "acapulco",
      eraId: "age-of-discovery",
      economicRole: "Entrepôt / middleman",
      origin: "grey",
      destination: "grey",
      era: "green",
      role: "grey",
    });
    const later = guess({
      originPortId: "lisbon",
      destinationPortId: "goa",
      eraId: "company-era",
      economicRole: "Source producer",
      origin: "grey",
      destination: "grey",
      era: "grey",
      role: "grey",
    });
    expect(deriveLocks([solved, later]).eraId).toBe("age-of-discovery");
  });
});
