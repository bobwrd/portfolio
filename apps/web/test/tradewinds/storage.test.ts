import { beforeEach, describe, expect, it } from "vitest";
import { loadProgress, loadStats, recordResult, saveProgress } from "../../src/tradewinds/lib/storage";
import type { StoredGuess } from "../../src/tradewinds/lib/storage";

const SAMPLE_GUESS: StoredGuess = {
  guess: { originPortId: "manila", destinationPortId: "acapulco", decade: 1590, economicRole: "Re-export hub" },
  feedback: {
    route: { level: "green", arrowBearing: 0 },
    era: { level: "green", direction: null },
    role: { level: "green", nudge: null },
  },
};

beforeEach(() => {
  localStorage.clear();
});

describe("progress persistence", () => {
  it("round-trips a day's progress", () => {
    expect(loadProgress("2026-07-28")).toBeNull();
    saveProgress({ runDate: "2026-07-28", history: [SAMPLE_GUESS], status: "won" });
    expect(loadProgress("2026-07-28")).toEqual({
      runDate: "2026-07-28",
      history: [SAMPLE_GUESS],
      status: "won",
    });
  });

  it("keeps different days independent", () => {
    saveProgress({ runDate: "2026-07-28", history: [], status: "in-progress" });
    expect(loadProgress("2026-07-29")).toBeNull();
  });
});

describe("recordResult", () => {
  it("starts a fresh streak on a win with no prior play", () => {
    const stats = recordResult("2026-07-28", "won", 4);
    expect(stats.currentStreak).toBe(1);
    expect(stats.maxStreak).toBe(1);
    expect(stats.gamesPlayed).toBe(1);
    expect(stats.distribution[3]).toBe(1);
  });

  it("extends the streak on a consecutive-day win", () => {
    recordResult("2026-07-27", "won", 2);
    const stats = recordResult("2026-07-28", "won", 5);
    expect(stats.currentStreak).toBe(2);
    expect(stats.maxStreak).toBe(2);
  });

  it("resets the streak after a skipped day", () => {
    recordResult("2026-07-25", "won", 2);
    const stats = recordResult("2026-07-28", "won", 3);
    expect(stats.currentStreak).toBe(1);
    expect(stats.maxStreak).toBe(1);
  });

  it("resets the streak on a loss but keeps max streak", () => {
    recordResult("2026-07-27", "won", 2);
    const stats = recordResult("2026-07-28", "lost");
    expect(stats.currentStreak).toBe(0);
    expect(stats.maxStreak).toBe(1);
    expect(stats.gamesPlayed).toBe(2);
  });

  it("defaults to empty stats when nothing is stored", () => {
    expect(loadStats()).toEqual({
      currentStreak: 0,
      maxStreak: 0,
      gamesPlayed: 0,
      distribution: new Array(10).fill(0),
      lastPlayedDate: null,
    });
  });
});
