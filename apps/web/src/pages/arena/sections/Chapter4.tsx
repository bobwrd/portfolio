import { useState } from "react";
import { Section, Card, Details, Slider } from "../shared";
import { LENSES, lensGrid, marketOutcomes, concentrationToHHI, type LensKey } from "../model";

const ZONE_FILL: Record<string, string> = {
  danger: "rgba(251, 113, 133, 0.32)",
  watch: "rgba(251, 191, 36, 0.28)",
  sweet: "rgba(52, 211, 153, 0.30)",
  neutral: "var(--arena-surface-2)",
};

const COLS = 12;
const ROWS = 8;

export default function Chapter4() {
  const [lensKey, setLensKey] = useState<LensKey>("consumer");
  const [C, setC] = useState(0.45);
  const [distSlider, setDistSlider] = useState(0.15);
  const D = distSlider * 0.4;

  const lens = LENSES.find((l) => l.key === lensKey)!;
  const cells = lensGrid(lens, COLS, ROWS);
  const now = marketOutcomes(C, D);
  const hhi = concentrationToHHI(C);
  const markerZone = lens.zone(C, D);

  // Marker position: x = concentration, y = distortion (0 at bottom).
  const markerLeft = C * 100;
  const markerTop = (1 - D / 0.4) * 100;

  return (
    <Section id="lenses" eyebrow="4 · Policy lenses" title="Same map, three referees">
      <div className="max-w-3xl mb-6 text-sm sm:text-base leading-relaxed" style={{ color: "var(--arena-text)" }}>
        One space, three readings. The grid is the same concentration-by-distortion plane from Chapter 3.
        Each lens shades the region it cares about and reads the same point differently.
      </div>

      {/* Lens buttons */}
      <div className="flex flex-wrap gap-2 mb-5">
        {LENSES.map((l) => {
          const on = l.key === lensKey;
          return (
            <button
              key={l.key}
              onClick={() => setLensKey(l.key)}
              className="rounded-md px-3.5 py-1.5 text-sm font-mono border transition-colors"
              style={{
                borderColor: on ? "var(--arena-accent)" : "var(--arena-border)",
                color: on ? "var(--arena-accent)" : "var(--arena-muted)",
                backgroundColor: on ? "var(--arena-accent-dim)" : "transparent",
              }}
            >
              {l.label}
            </button>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-5 gap-6 items-start">
        {/* The heat grid */}
        <div className="lg:col-span-3">
          <Card>
            <div className="flex">
              {/* Y axis label */}
              <div className="flex flex-col justify-between items-center mr-2 py-1">
                <span className="text-[0.6rem] font-mono" style={{ color: "var(--arena-muted)" }}>40%</span>
                <span
                  className="text-[0.6rem] font-mono"
                  style={{ color: "var(--arena-muted)", writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                >
                  distortion
                </span>
                <span className="text-[0.6rem] font-mono" style={{ color: "var(--arena-muted)" }}>0%</span>
              </div>

              {/* Grid */}
              <div className="flex-1">
                <div
                  className="relative w-full rounded-md overflow-hidden"
                  style={{ aspectRatio: `${COLS} / ${ROWS}`, border: "1px solid var(--arena-border)" }}
                >
                  <div
                    className="absolute inset-0 grid"
                    style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)` }}
                  >
                    {cells.map((cell, i) => (
                      <div
                        key={i}
                        style={{
                          backgroundColor: ZONE_FILL[cell.zone],
                          transition: "background-color 220ms ease",
                          borderRight: "1px solid var(--arena-bg)",
                          borderBottom: "1px solid var(--arena-bg)",
                        }}
                      />
                    ))}
                  </div>
                  {/* Current point marker */}
                  <div
                    className="absolute h-3.5 w-3.5 rounded-full -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${markerLeft}%`,
                      top: `${markerTop}%`,
                      backgroundColor: "var(--arena-accent)",
                      border: "2px solid var(--arena-bg)",
                      boxShadow: "0 0 0 2px var(--arena-accent)",
                      transition: "left 200ms ease, top 200ms ease",
                    }}
                  />
                </div>
                {/* X axis */}
                <div className="flex justify-between mt-1.5">
                  <span className="text-[0.6rem] font-mono" style={{ color: "var(--arena-muted)" }}>competitive</span>
                  <span className="text-[0.6rem] font-mono" style={{ color: "var(--arena-muted)" }}>concentration →</span>
                  <span className="text-[0.6rem] font-mono" style={{ color: "var(--arena-muted)" }}>monopoly</span>
                </div>
              </div>
            </div>

            {/* Zone legend */}
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
              {[
                { z: "danger", label: "flagged / danger" },
                { z: "watch", label: "watch" },
                { z: "sweet", label: "sweet spot" },
                { z: "neutral", label: "neutral" },
              ].map((x) => (
                <div key={x.z} className="flex items-center gap-1.5">
                  <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: ZONE_FILL[x.z], border: "1px solid var(--arena-border)" }} />
                  <span className="text-[0.65rem] font-mono" style={{ color: "var(--arena-muted)" }}>{x.label}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Commentary + point controls */}
        <div className="lg:col-span-2 space-y-4">
          <Card title={lens.label}>
            <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--arena-text)" }}>
              {lens.blurb}
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--arena-muted)" }}>
              {lens.commentary}
            </p>

            <div className="mt-4 rounded-lg p-3" style={{ backgroundColor: "var(--arena-surface-2)" }}>
              <div className="text-[0.6rem] font-mono uppercase tracking-wider mb-1" style={{ color: "var(--arena-muted)" }}>
                Your point
              </div>
              <div className="text-sm font-mono" style={{ color: "var(--arena-text)" }}>
                HHI proxy <span style={{ color: "var(--arena-accent)" }}>{hhi.toLocaleString()}</span> · price{" "}
                {now.price.toFixed(0)} · surplus {now.surplus.toFixed(0)} ·{" "}
                <span style={{ color: markerZone === "danger" ? "var(--arena-warn)" : markerZone === "sweet" ? "var(--arena-good)" : "var(--arena-muted)" }}>
                  {markerZone}
                </span>
              </div>
            </div>
          </Card>

          <Card title="Move the point">
            <div className="space-y-5">
              <Slider
                label="Market concentration"
                lo="competitive"
                hi="monopoly"
                badge={`HHI ${hhi}`}
                value={C}
                onChange={setC}
              />
              <Slider
                label="Behavioural distortion"
                lo="0%"
                hi="40%"
                badge={`${Math.round(D * 100)}%`}
                value={distSlider}
                onChange={setDistSlider}
              />
            </div>
          </Card>
        </div>
      </div>

      <Details summary="Details · thresholds & sources">
        <p>
          The antitrust bands use the US merger-guidelines screens: HHI above 2500 is highly concentrated
          (2010 Horizontal Merger Guidelines), and the 2023 Merger Guidelines tightened the structural
          presumption to HHI 1800 with a 100-point change screen. Concentration maps to HHI under a
          symmetric-firm assumption (HHI = 10000 / number of equal firms); real markets are asymmetric, so
          this mapping is illustrative, flagged in the methodology. The consumer sweet spot and the firm
          strategist's destructive-competition corner reuse the Chapter 3 outcome model and the excess-entry
          result of Mankiw and Whinston (1986). No threshold here is invented for effect.
        </p>
      </Details>
    </Section>
  );
}
