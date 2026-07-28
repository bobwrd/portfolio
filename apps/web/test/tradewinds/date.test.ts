import { describe, expect, it } from "vitest";
import { formatCountdown, isConsecutiveDay, toLocalDateString } from "../../src/tradewinds/lib/date";

describe("toLocalDateString", () => {
  it("formats as YYYY-MM-DD", () => {
    expect(toLocalDateString(new Date(2026, 6, 28))).toBe("2026-07-28");
  });

  it("pads single-digit months and days", () => {
    expect(toLocalDateString(new Date(2026, 0, 5))).toBe("2026-01-05");
  });
});

describe("isConsecutiveDay", () => {
  it("is true for back-to-back dates", () => {
    expect(isConsecutiveDay("2026-07-27", "2026-07-28")).toBe(true);
  });

  it("is true across a month boundary", () => {
    expect(isConsecutiveDay("2026-07-31", "2026-08-01")).toBe(true);
  });

  it("is false when a day is skipped", () => {
    expect(isConsecutiveDay("2026-07-26", "2026-07-28")).toBe(false);
  });

  it("is false for the same date", () => {
    expect(isConsecutiveDay("2026-07-28", "2026-07-28")).toBe(false);
  });
});

describe("formatCountdown", () => {
  it("formats as HH:MM:SS", () => {
    expect(formatCountdown(3_723_000)).toBe("01:02:03");
  });

  it("floors negative durations to zero", () => {
    expect(formatCountdown(-500)).toBe("00:00:00");
  });
});
