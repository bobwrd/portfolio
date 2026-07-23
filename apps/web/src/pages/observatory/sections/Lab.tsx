import { useMemo, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine, Legend,
} from "recharts";
import { Section, Card, Caption, Details, Eq, useChartTheme } from "../shared";
import { useObservatoryTheme } from "../ObservatoryLayout";
import {
  buildLab, simulate, dynamicNarrative, labLabel, DEFAULT_SLIDERS,
  LAB_PRESETS, type LabSliders, type SimResult,
} from "../model";

// ---------------------------------------------------------------------------
// Slider control
// ---------------------------------------------------------------------------

const SLIDERS: { key: keyof LabSliders; label: string; lo: string; hi: string }[] = [
  { key: "adoptionSpeed", label: "Speed of AI adoption", lo: "slow", hi: "fast" },
  { key: "wageShare", label: "Share of AI gains going to wages", lo: "profits", hi: "wages" },
  { key: "hawkishness", label: "Central bank hawkishness", lo: "dovish", hi: "hawkish" },
  { key: "labourReplace", label: "Labour-replacing vs complementing", lo: "complement", hi: "replace" },
];

function Slider({
  label, lo, hi, value, onChange,
}: {
  label: string; lo: string; hi: string; value: number; onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <label className="text-sm font-medium" style={{ color: "var(--obs-text)" }}>{label}</label>
        <span className="text-xs font-mono px-1.5 py-0.5 rounded" style={{ color: "var(--obs-accent)", backgroundColor: "var(--obs-accent-dim)" }}>
          {labLabel(value)}
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="obs-range w-full"
      />
      <div className="flex justify-between text-[0.65rem] font-mono mt-0.5" style={{ color: "var(--obs-muted)" }}>
        <span>{lo}</span>
        <span>{hi}</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Chart — supports baseline (dashed) and scenario (solid) line pairs
// ---------------------------------------------------------------------------

interface ChartLine {
  key: string;
  name: string;
  color: string;
  dashed?: boolean;
}

function OutChart({
  title, data, lines, unit, target, caption,
}: {
  title: string;
  data: Record<string, number>[];
  lines: ChartLine[];
  unit: string;
  target?: number;
  caption?: string;
}) {
  const { theme } = useObservatoryTheme();
  const ct = useChartTheme(theme);
  return (
    <Card title={title}>
      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 6, right: 14, bottom: 2, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={ct.grid} vertical={false} />
            <XAxis dataKey="year" tick={ct.tick} axisLine={{ stroke: ct.grid }} tickLine={false} interval="preserveStartEnd" />
            <YAxis tick={ct.tick} axisLine={false} tickLine={false} width={36} tickFormatter={(v) => `${v}${unit}`} />
            <Tooltip
              contentStyle={ct.tooltip}
              formatter={(v: number, n: string) => [`${Number(v).toFixed(1)}${unit}`, n]}
              labelFormatter={(l) => `Year ${l}`}
            />
            {target != null && (
              <ReferenceLine y={target} stroke="var(--obs-muted)" strokeDasharray="4 4" label={{ value: `${target}% target`, position: "insideTopRight", fontSize: 9, fill: "var(--obs-muted)" }} />
            )}
            <Legend wrapperStyle={{ fontSize: 10, fontFamily: "ui-monospace, monospace" }} />
            {lines.map((l) => (
              <Line
                key={l.key}
                type="monotone"
                dataKey={l.key}
                name={l.name}
                stroke={l.color}
                strokeWidth={l.dashed ? 1.6 : 2.2}
                strokeDasharray={l.dashed ? "5 4" : undefined}
                strokeOpacity={l.dashed ? 0.65 : 1}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      {caption && <Caption>{caption}</Caption>}
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Build merged chart rows from baseline + scenario sims
// ---------------------------------------------------------------------------

function buildRows(baseSim: SimResult, scenSim: SimResult) {
  return baseSim.years.map((y, i) => ({
    year: y,
    inflationBase: baseSim.inflation[i],
    inflation: scenSim.inflation[i],
    unemploymentBase: baseSim.unemployment[i],
    unemployment: scenSim.unemployment[i],
    wageHighBase: baseSim.realWageHigh[i],
    wageHigh: scenSim.realWageHigh[i],
    wageLowBase: baseSim.realWageLow[i],
    wageLow: scenSim.realWageLow[i],
  }));
}

// ---------------------------------------------------------------------------
// CSV download
// ---------------------------------------------------------------------------

function downloadCSV(baseSim: SimResult, scenSim: SimResult) {
  const header = [
    "year",
    "inflation_baseline_%", "inflation_scenario_%",
    "unemployment_baseline_%", "unemployment_scenario_%",
    "wage_high_index_baseline", "wage_high_index_scenario",
    "wage_low_index_baseline", "wage_low_index_scenario",
  ].join(",");
  const rows = baseSim.years.map((yr, i) =>
    [
      yr,
      baseSim.inflation[i], scenSim.inflation[i],
      baseSim.unemployment[i], scenSim.unemployment[i],
      baseSim.realWageHigh[i], scenSim.realWageHigh[i],
      baseSim.realWageLow[i], scenSim.realWageLow[i],
    ].join(",")
  );
  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "observatory-lab-model-paths.csv";
  a.click();
  URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------------------
// Main Lab component
// ---------------------------------------------------------------------------

export default function Lab() {
  // Scenario = current slider values (user-controlled)
  const [sliders, setSliders] = useState<LabSliders>(DEFAULT_SLIDERS);
  // Baseline = dashed comparison line; starts at default medium
  const [baseline, setBaseline] = useState<LabSliders>(DEFAULT_SLIDERS);
  // Which preset is currently matching the slider values (null = custom)
  const [activePreset, setActivePreset] = useState<string | null>(null);

  // Paycheque calculator state
  const [paychequeWage, setPaychequeWage] = useState(50000);
  const [paychequeType, setPaychequeType] = useState<"high" | "low">("low");

  const scenSim = useMemo(() => {
    const { exog, params } = buildLab(sliders);
    return simulate(exog, params, 0);
  }, [sliders]);

  const baseSim = useMemo(() => {
    const { exog, params } = buildLab(baseline);
    return simulate(exog, params, 0);
  }, [baseline]);

  const rows = useMemo(() => buildRows(baseSim, scenSim), [baseSim, scenSim]);
  const narrative = useMemo(() => dynamicNarrative(scenSim), [scenSim]);

  // Wage gap at year 10
  const yr10 = Math.min(9, scenSim.years.length - 1);
  const baseGap = Math.round(baseSim.realWageHigh[yr10] - baseSim.realWageLow[yr10]);
  const scenGap = Math.round(scenSim.realWageHigh[yr10] - scenSim.realWageLow[yr10]);

  // Paycheque calculator
  const yr10BaseIdx = paychequeType === "high" ? baseSim.realWageHigh[yr10] : baseSim.realWageLow[yr10];
  const yr10ScenIdx = paychequeType === "high" ? scenSim.realWageHigh[yr10] : scenSim.realWageLow[yr10];
  const yr10BaseWage = Math.round(paychequeWage * yr10BaseIdx / 100);
  const yr10ScenWage = Math.round(paychequeWage * yr10ScenIdx / 100);

  function handleSliderChange(key: keyof LabSliders, v: number) {
    setSliders((prev) => ({ ...prev, [key]: v }));
    setActivePreset(null); // any manual tweak clears active preset
  }

  function applyPreset(p: typeof LAB_PRESETS[number]) {
    setSliders(p.sliders);
    setActivePreset(p.key);
  }

  const inflationLines: ChartLine[] = [
    { key: "inflationBase", name: "Inflation — baseline", color: "var(--obs-c2)", dashed: true },
    { key: "inflation", name: "Inflation — scenario", color: "var(--obs-c2)" },
  ];
  const unemploymentLines: ChartLine[] = [
    { key: "unemploymentBase", name: "Unemployment — baseline", color: "var(--obs-c4)", dashed: true },
    { key: "unemployment", name: "Unemployment — scenario", color: "var(--obs-c4)" },
  ];
  const wageLines: ChartLine[] = [
    { key: "wageHighBase", name: "Higher-skill — baseline", color: "var(--obs-c1)", dashed: true },
    { key: "wageHigh", name: "Higher-skill — scenario", color: "var(--obs-c1)" },
    { key: "wageLowBase", name: "Lower-skill — baseline", color: "var(--obs-c3)", dashed: true },
    { key: "wageLow", name: "Lower-skill — scenario", color: "var(--obs-c3)" },
  ];

  const baselineIsMedium =
    baseline.adoptionSpeed === DEFAULT_SLIDERS.adoptionSpeed &&
    baseline.wageShare === DEFAULT_SLIDERS.wageShare &&
    baseline.hawkishness === DEFAULT_SLIDERS.hawkishness &&
    baseline.labourReplace === DEFAULT_SLIDERS.labourReplace;

  return (
    <Section id="lab" eyebrow="3 · Lab" title="Drive the model yourself">
      <div className="max-w-3xl mb-6 text-sm sm:text-base leading-relaxed" style={{ color: "var(--obs-text)" }}>
        A toy model, not a prediction. Move the sliders and the paths recompute. Dashed lines show the baseline;
        solid lines show the current scenario. The point is to feel how adoption speed, who captures the gains,
        and the central bank's stance interact — not to read off numbers.
      </div>

      {/* Preset buttons */}
      <div className="mb-5">
        <div className="text-[0.65rem] font-mono uppercase tracking-wider mb-2" style={{ color: "var(--obs-muted)" }}>
          Named scenarios
        </div>
        <div className="flex flex-wrap gap-2">
          {LAB_PRESETS.map((p) => {
            const on = activePreset === p.key;
            return (
              <button
                key={p.key}
                onClick={() => applyPreset(p)}
                title={p.description}
                className="rounded-md px-3 py-1.5 text-xs font-mono border transition-colors"
                style={{
                  borderColor: on ? "var(--obs-accent)" : "var(--obs-border)",
                  color: on ? "var(--obs-accent)" : "var(--obs-muted)",
                  backgroundColor: on ? "var(--obs-accent-dim)" : "transparent",
                }}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        {/* Controls */}
        <Card title="Controls" className="lg:col-span-2">
          <div className="space-y-5">
            {SLIDERS.map((sl) => (
              <Slider
                key={sl.key}
                label={sl.label}
                lo={sl.lo}
                hi={sl.hi}
                value={sliders[sl.key]}
                onChange={(v) => handleSliderChange(sl.key, v)}
              />
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={() => { setSliders(DEFAULT_SLIDERS); setBaseline(DEFAULT_SLIDERS); setActivePreset(null); }}
              className="text-xs font-mono px-3 py-1.5 rounded border transition-colors"
              style={{ borderColor: "var(--obs-border)", color: "var(--obs-muted)" }}
            >
              Reset to medium
            </button>
            <button
              onClick={() => setBaseline(sliders)}
              className="text-xs font-mono px-3 py-1.5 rounded border transition-colors"
              style={{ borderColor: "var(--obs-accent)", color: "var(--obs-accent)" }}
            >
              Set baseline = current
            </button>
          </div>

          {!baselineIsMedium && (
            <p className="mt-2 text-[0.65rem] leading-relaxed" style={{ color: "var(--obs-muted)" }}>
              Custom baseline is set. "Reset to medium" restores both lines to the default.
            </p>
          )}

          <div className="mt-5 rounded-lg p-3 text-sm leading-relaxed" style={{ backgroundColor: "var(--obs-surface-2)", color: "var(--obs-muted)", fontSize: "0.72rem" }}>
            Dashed lines = baseline · Solid lines = scenario. Change sliders to move the scenario; use "Set baseline = current" to anchor a new dashed reference.
          </div>
        </Card>

        {/* Charts */}
        <div className="lg:col-span-3 grid sm:grid-cols-2 gap-5">
          <OutChart
            title="Inflation (%)"
            data={rows}
            unit="%"
            target={2}
            lines={inflationLines}
            caption="Model paths. Dashed = baseline, solid = scenario. Inflation target (2%) marked."
          />
          <OutChart
            title="Unemployment (%)"
            data={rows}
            unit="%"
            lines={unemploymentLines}
            caption="Model paths. Percentage of the labour force."
          />
          <OutChart
            title="Real wage index (base 100)"
            data={rows}
            unit=""
            lines={wageLines}
            caption="Index: both groups start at 100. Gap between lines is the distributional outcome."
          />
          <Card title="How to read this">
            <p className="text-sm leading-relaxed" style={{ color: "var(--obs-muted)" }}>
              Watch the gap between the two wage lines: it widens when adoption is fast, gains tilt to profits,
              and AI is labour-replacing. Inflation and unemployment trade off through the central bank's
              reaction. Compare scenario (solid) to baseline (dashed) to isolate the effect of your settings.
              Try the extremes to see the mechanism clearly.
            </p>

            {/* Wage gap readout */}
            <div className="mt-4 rounded-lg p-3 text-xs font-mono" style={{ backgroundColor: "var(--obs-surface-2)", color: "var(--obs-text)" }}>
              <div className="font-semibold mb-1" style={{ color: "var(--obs-muted)" }}>Wage gap at year 10</div>
              <div className="flex gap-4 flex-wrap">
                <span>
                  <span style={{ color: "var(--obs-muted)" }}>Baseline: </span>
                  <span style={{ color: baseGap > 8 ? "var(--obs-warn)" : "var(--obs-accent)" }}>
                    {baseGap >= 0 ? "+" : ""}{baseGap} pts
                  </span>
                </span>
                <span>
                  <span style={{ color: "var(--obs-muted)" }}>Scenario: </span>
                  <span style={{ color: scenGap > 8 ? "var(--obs-warn)" : "var(--obs-accent)" }}>
                    {scenGap >= 0 ? "+" : ""}{scenGap} pts
                  </span>
                </span>
              </div>
              <div className="mt-1.5" style={{ color: "var(--obs-muted)" }}>
                Higher-skill: {scenSim.realWageHigh[yr10].toFixed(0)} · Lower-skill: {scenSim.realWageLow[yr10].toFixed(0)}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Dynamic narrative panel */}
      <div className="mt-5 rounded-xl border p-5" style={{ borderColor: "var(--obs-border)", backgroundColor: "var(--obs-surface)" }}>
        <div className="text-[0.65rem] font-mono uppercase tracking-wider mb-3" style={{ color: "var(--obs-accent)" }}>
          What this scenario implies
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { label: "Prices", text: narrative.inflation },
            { label: "Labour market", text: narrative.unemployment },
            { label: "Wage distribution", text: narrative.wageGap },
          ].map(({ label, text }) => (
            <div key={label}>
              <div className="text-xs font-mono mb-1.5" style={{ color: "var(--obs-muted)" }}>{label}</div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--obs-text)" }}>{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Paycheque calculator */}
      <div className="mt-5 rounded-xl border p-5" style={{ borderColor: "var(--obs-border)", backgroundColor: "var(--obs-surface)" }}>
        <div className="text-[0.65rem] font-mono uppercase tracking-wider mb-1" style={{ color: "var(--obs-accent)" }}>
          What this could feel like on a paycheque
        </div>
        <p className="text-xs mb-4 leading-relaxed" style={{ color: "var(--obs-muted)" }}>
          Illustrative only. Applies the model's wage index to a starting salary to show the direction and
          rough order of magnitude — not a personalised forecast.
        </p>
        <div className="flex flex-wrap gap-4 items-end mb-4">
          <div>
            <label className="block text-xs font-mono mb-1" style={{ color: "var(--obs-muted)" }}>
              Starting annual wage
            </label>
            <input
              type="number"
              min={0}
              step={1000}
              value={paychequeWage}
              onChange={(e) => setPaychequeWage(Math.max(0, parseInt(e.target.value) || 0))}
              className="rounded border px-2.5 py-1.5 text-sm font-mono w-36"
              style={{
                borderColor: "var(--obs-border)",
                backgroundColor: "var(--obs-surface-2)",
                color: "var(--obs-text)",
              }}
            />
          </div>
          <div>
            <label className="block text-xs font-mono mb-1" style={{ color: "var(--obs-muted)" }}>
              Worker type
            </label>
            <select
              value={paychequeType}
              onChange={(e) => setPaychequeType(e.target.value as "high" | "low")}
              className="rounded border px-2.5 py-1.5 text-sm font-mono"
              style={{
                borderColor: "var(--obs-border)",
                backgroundColor: "var(--obs-surface-2)",
                color: "var(--obs-text)",
              }}
            >
              <option value="high">Higher-skill worker</option>
              <option value="low">Lower-skill worker</option>
            </select>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { label: "Baseline — year 10", wage: yr10BaseWage, idx: yr10BaseIdx },
            { label: "Scenario — year 10", wage: yr10ScenWage, idx: yr10ScenIdx },
          ].map(({ label, wage, idx }) => (
            <div key={label} className="rounded-lg p-3" style={{ backgroundColor: "var(--obs-surface-2)" }}>
              <div className="text-xs font-mono mb-1" style={{ color: "var(--obs-muted)" }}>{label}</div>
              <div className="text-xl font-mono font-semibold" style={{ color: "var(--obs-accent)" }}>
                {wage.toLocaleString()}
              </div>
              <div className="text-[0.65rem] font-mono mt-0.5" style={{ color: "var(--obs-muted)" }}>
                wage index: {idx.toFixed(1)} · in today's dollars, roughly
              </div>
            </div>
          ))}
        </div>
        {yr10ScenWage !== yr10BaseWage && (
          <p className="mt-3 text-xs leading-relaxed" style={{ color: "var(--obs-muted)" }}>
            The scenario implies a real-wage difference of{" "}
            <span className="font-mono" style={{ color: yr10ScenWage > yr10BaseWage ? "var(--obs-accent)" : "var(--obs-warn)" }}>
              {yr10ScenWage > yr10BaseWage ? "+" : ""}{(yr10ScenWage - yr10BaseWage).toLocaleString()}
            </span>{" "}
            relative to baseline at year 10 for a {paychequeType === "high" ? "higher-skill" : "lower-skill"} worker starting at {paychequeWage.toLocaleString()}.
            This is illustrative, not a personalised forecast.
          </p>
        )}
      </div>

      {/* CSV download */}
      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={() => downloadCSV(baseSim, scenSim)}
          className="text-xs font-mono px-3 py-1.5 rounded border transition-colors flex items-center gap-1.5"
          style={{ borderColor: "var(--obs-accent)", color: "var(--obs-accent)" }}
        >
          ↓ Download model paths (CSV)
        </button>
        <span className="text-xs" style={{ color: "var(--obs-muted)" }}>
          Baseline + scenario paths for all four variables, 15 years.
        </span>
      </div>

      <Details summary="Details · functional form & parameters">
        <p>The Lab uses the same engine as the scenarios (one step = one year):</p>
        <Eq>πₑ = ω·π* + (1−ω)·π₋₁</Eq>
        <Eq>y = ρ·y₋₁ + invest − σ·(i₋₁ − π₋₁ − r*)</Eq>
        <Eq>π = πₑ + κ·y − λ·g</Eq>
        <Eq>i = max(0, r* + π* + φπ·(π − π*) + φy·y),  u = u* − Okun·y</Eq>
        <p className="mt-2">Real wages split the labour share of gains across two groups:</p>
        <Eq>pool = g · wageShare</Eq>
        <Eq>highₜ = pool · (1 + 0.8·replace)</Eq>
        <Eq>lowₜ = pool · (1 − 1.7·replace) − 0.6·g·replace</Eq>
        <p className="mt-2">Slider mappings:</p>
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li><strong>Adoption speed</strong> → steepness and timing of the logistic productivity path <em>g</em>, plus the size of the investment hump and how anchored expectations are (faster = less anchored, lower ω).</li>
          <li><strong>Wage share</strong> → the fraction of <em>g</em> that flows to wages rather than profits.</li>
          <li><strong>Hawkishness</strong> → the Taylor-rule coefficient φπ (1.1 dovish to 2.5 hawkish). Baseline: 1.8.</li>
          <li><strong>Labour-replacing vs complementing</strong> → how the labour share splits between the two skill groups, and the displacement drag on lower-skill wages.</li>
        </ul>
        <p className="mt-2">
          What it deliberately omits: stochastic shocks, an explicit financial sector, open-economy/exchange-rate
          effects, sector detail, and any structural microfoundations. It is built for intuition about direction
          and trade-offs, not magnitudes.
        </p>
      </Details>
    </Section>
  );
}
