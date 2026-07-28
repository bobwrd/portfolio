import { describe, expect, it } from "vitest";
import { bearing, compassLabel, midpoint } from "../src/geo.js";

describe("midpoint", () => {
  it("returns the same point when start and end are equal", () => {
    const [lat, lon] = midpoint(10, 20, 10, 20);
    expect(lat).toBeCloseTo(10, 5);
    expect(lon).toBeCloseTo(20, 5);
  });
});

describe("bearing", () => {
  it("points north when the target is due north", () => {
    expect(bearing(0, 0, 10, 0)).toBeCloseTo(0, 0);
  });

  it("points east when the target is due east on the equator", () => {
    expect(bearing(0, 0, 0, 10)).toBeCloseTo(90, 0);
  });

  it("points south when the target is due south", () => {
    expect(bearing(10, 0, 0, 0)).toBeCloseTo(180, 0);
  });
});

describe("compassLabel", () => {
  it("labels the 4 cardinal directions", () => {
    expect(compassLabel(0)).toBe("N");
    expect(compassLabel(90)).toBe("E");
    expect(compassLabel(180)).toBe("S");
    expect(compassLabel(270)).toBe("W");
  });

  it("wraps 360 back to N", () => {
    expect(compassLabel(360)).toBe("N");
  });
});
