import { describe, expect, it } from "vitest";
import { findPort, PORTS, searchPorts } from "../src/ports.js";

describe("PORTS", () => {
  it("has unique ids", () => {
    const ids = new Set(PORTS.map((p) => p.id));
    expect(ids.size).toBe(PORTS.length);
  });

  it("has valid lat/lon for every port", () => {
    for (const p of PORTS) {
      expect(p.lat).toBeGreaterThanOrEqual(-90);
      expect(p.lat).toBeLessThanOrEqual(90);
      expect(p.lon).toBeGreaterThanOrEqual(-180);
      expect(p.lon).toBeLessThanOrEqual(180);
    }
  });

  it("covers the ports needed by the seed puzzles", () => {
    const required = [
      "manila",
      "acapulco",
      "alexandria",
      "ostia",
      "lubeck",
      "novgorod",
      "timbuktu",
      "sijilmasa",
      "guangzhou",
      "amsterdam",
      "khotan",
      "changan",
      "salvador",
      "lisbon",
    ];
    for (const id of required) {
      expect(findPort(PORTS, id), `missing port ${id}`).toBeDefined();
    }
  });
});

describe("searchPorts", () => {
  it("matches by name", () => {
    expect(searchPorts(PORTS, "manila").map((p) => p.id)).toEqual(["manila"]);
  });

  it("matches by region", () => {
    const results = searchPorts(PORTS, "baltic");
    expect(results.length).toBeGreaterThan(0);
    for (const p of results) expect(p.region).toBe("Baltic");
  });

  it("returns everything for an empty query", () => {
    expect(searchPorts(PORTS, "").length).toBe(PORTS.length);
  });
});
