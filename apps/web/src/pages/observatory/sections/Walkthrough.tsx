import { useMemo, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
  LineChart, Line, ReferenceLine,
} from "recharts";
import { Section, Card, Details, Caption, Eq, useChartTheme } from "../shared";
import { useObservatoryTheme } from "../ObservatoryLayout";
import { annualGrowth, type ObservatoryData } from "../types";
import { simulate, buildScenario, SCENARIOS, type ScenarioKey } from "../model";

// --- Step 1: micro vs macro -----------------------------------------------

const MICRO = [
  { label: "Customer support", value: 14, note: "issues resolved/hr (avg)" },
  { label: "Coding", value: 56, note: "task time saved" },
  { label: "Professional writing", value: 40, note: "task time saved" },
  { label: "Consulting tasks", value: 25, note: "speed on in-scope tasks" },
];

function Step1({ data, country }: { data: ObservatoryData | null; country: string }) {
  const { theme } = useObservatoryTheme();
  const ct = useChartTheme(theme);

  // Real macro comparison: recent annualised growth in GDP per person employed.
  const macro = useMemo(() => {
    const s = data?.series[country]?.gdp_per_worker;
    if (!s || s.length < 6) return [] as { label: string; value: number }[];
    const g = annualGrowth(s);
    const last5 = g.slice(-5);
    const avg5 = last5.reduce((a, b) => a + b.value, 0) / last5.length;
    const last10 = g.slice(-10);
    const avg10 = last10.reduce((a, b) => a + b.value, 0) / last10.length;
    return [
      { label: "Last 10y avg", value: round(avg10) },
      { label: "Last 5y avg", value: round(avg5) },
    ];
  }, [data, country]);

  const cName = data?.country_names[country] ?? country;

  return (
    <div>
      <p className="text-sm sm:text-base leading-relaxed max-w-3xl mb-6" style={{ color: "var(--obs-text)" }}>
        <strong style={{ color: "var(--obs-accent)" }}>Step 1.</strong> Task-level studies find large AI
        productivity gains, often tens of percent. Yet economy-wide productivity growth still moves in the
        low single digits. The gap between the two is the whole puzzle: micro gains have to survive
        reallocation, diffusion lags and measurement before they show up in the macro numbers.
      </p>

      <div className="grid md:grid-cols-2 gap-5">
        <Card title="Task-level gains from AI (selected studies)">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MICRO} layout="vertical" margin={{ top: 4, right: 24, bottom: 4, left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={ct.grid} horizontal={false} />
                <XAxis type="number" tick={ct.tick} axisLine={{ stroke: ct.grid }} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="label" width={110} tick={ct.tick} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={ct.tooltip} cursor={{ fill: "var(--obs-accent-dim)" }} formatter={(v: number, _n, p: any) => [`+${v}% — ${p.payload.note}`, "gain"]} />
                <Bar dataKey="value" fill="var(--obs-c1)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <Caption>Percent improvement on specific tasks in controlled studies. Scales differ across studies; treat as orders of magnitude, not a single metric.</Caption>
        </Card>

        <Card title={`Economy-wide productivity growth — ${cName}`}>
          <div className="h-64 w-full">
            {macro.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={macro} margin={{ top: 4, right: 16, bottom: 4, left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={ct.grid} vertical={false} />
                  <XAxis dataKey="label" tick={ct.tick} axisLine={{ stroke: ct.grid }} tickLine={false} />
                  <YAxis tick={ct.tick} axisLine={{ stroke: ct.grid }} tickLine={false} tickFormatter={(v) => `${v}%`} domain={[0, "auto"]} />
                  <Tooltip contentStyle={ct.tooltip} cursor={{ fill: "var(--obs-accent-dim)" }} formatter={(v: number) => [`${v}%/yr`, "growth"]} />
                  <Bar dataKey="value" fill="var(--obs-c3)" radius={[4, 4, 0, 0]}>
                    {macro.map((_, i) => <Cell key={i} fill="var(--obs-c3)" />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full grid place-items-center text-sm" style={{ color: "var(--obs-muted)" }}>Loading…</div>
            )}
          </div>
          <Caption>Average annual growth in GDP per person employed (World Bank). Note the y-axis: single digits, against tens of percent on the left.</Caption>
        </Card>
      </div>

      <Details summary="Details · sources & caveats">
        <p>Task-level figures are drawn from widely cited field studies:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Customer support: Brynjolfsson, Li &amp; Raymond (2023), generative AI raised issues resolved per hour by ~14% on average (more for novices).</li>
          <li>Coding: Peng et al. (2023), developers using an AI assistant completed a task ~56% faster in a randomised trial.</li>
          <li>Writing: Noy &amp; Zhang (2023, <em>Science</em>), professional writing tasks ~40% faster with higher rated quality.</li>
          <li>Consulting: Dell'Acqua et al. (2023), consultants ~25% faster and more productive on tasks inside the AI's "frontier".</li>
        </ul>
        <p className="mt-2">
          These are task experiments, not whole-job or whole-economy effects. The macro bars use World Bank GDP per
          person employed, which is broader than (and not identical to) total factor productivity. Diffusion takes
          years, gains can be competed away into lower prices, and some output is mismeasured. That is exactly why
          a +50% task result and a ~1.5% macro number can both be true.
        </p>
      </Details>
    </div>
  );
}

// --- Step 2: channel flow diagram -----------------------------------------

type ChannelKey = "cost" | "demand" | "relative";

const CHANNELS: { key: ChannelKey; label: string; blurb: string; edges: string[] }[] = [
  {
    key: "cost",
    label: "Cost channel",
    blurb: "AI raises productivity, lowering unit costs. In competitive markets, lower costs feed into lower prices — disinflation.",
    edges: ["adopt-prod", "prod-cost", "cost-infl"],
  },
  {
    key: "demand",
    label: "Demand channel",
    blurb: "The AI build-out (data centres, chips, software) is a wave of investment that lifts demand. If it outruns supply, it is inflationary.",
    edges: ["adopt-demand", "demand-infl", "demand-emp"],
  },
  {
    key: "relative",
    label: "Relative price channel",
    blurb: "AI makes some inputs (compute, software) cheaper while others (electricity, skilled labour, hardware) get bid up — relative prices shift even if the average barely moves.",
    edges: ["adopt-demand", "demand-wages", "wages-infl", "prod-cost"],
  },
];

const NODES: Record<string, { x: number; y: number; label: string }> = {
  adopt: { x: 60, y: 130, label: "AI adoption" },
  prod: { x: 240, y: 60, label: "Productivity" },
  demand: { x: 240, y: 200, label: "Demand &\ninvestment" },
  cost: { x: 430, y: 60, label: "Unit costs" },
  wages: { x: 430, y: 200, label: "Wages &\nprofits" },
  infl: { x: 630, y: 110, label: "Inflation" },
  emp: { x: 630, y: 240, label: "Employment" },
};

const EDGES: Record<string, [string, string]> = {
  "adopt-prod": ["adopt", "prod"],
  "adopt-demand": ["adopt", "demand"],
  "prod-cost": ["prod", "cost"],
  "cost-infl": ["cost", "infl"],
  "demand-infl": ["demand", "infl"],
  "demand-wages": ["demand", "wages"],
  "demand-emp": ["demand", "emp"],
  "wages-infl": ["wages", "infl"],
};

const NODE_VARS: { node: string; example: string }[] = [
  { node: "AI adoption", example: "spend on software, data centres, chips" },
  { node: "Productivity", example: "output per hour, GDP per worker" },
  { node: "Unit costs", example: "cost per unit of output, markups" },
  { node: "Demand & investment", example: "non-residential IT investment" },
  { node: "Wages & profits", example: "labour share, real earnings by skill" },
  { node: "Inflation", example: "headline & core CPI, core PCE" },
  { node: "Employment", example: "information-sector jobs, unemployment" },
];

function FlowDiagram() {
  const [active, setActive] = useState<ChannelKey>("cost");
  const channel = CHANNELS.find((c) => c.key === active)!;
  const activeEdges = new Set(channel.edges);

  function edgePath(from: string, to: string) {
    const a = NODES[from], b = NODES[to];
    const mx = (a.x + b.x) / 2;
    return `M ${a.x + 64} ${a.y} C ${mx} ${a.y}, ${mx} ${b.y}, ${b.x - 4} ${b.y}`;
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {CHANNELS.map((c) => {
          const on = c.key === active;
          return (
            <button
              key={c.key}
              onClick={() => setActive(c.key)}
              className="rounded-full px-3.5 py-1.5 text-xs font-mono border transition-colors"
              style={{
                borderColor: on ? "var(--obs-accent)" : "var(--obs-border)",
                color: on ? "var(--obs-accent)" : "var(--obs-muted)",
                backgroundColor: on ? "var(--obs-accent-dim)" : "transparent",
              }}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      <Card>
        <div className="w-full overflow-x-auto">
          <svg viewBox="0 0 720 300" className="w-full" style={{ minWidth: 560 }} role="img" aria-label="AI to inflation channel diagram">
            <defs>
              <marker id="arrow-dim" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--obs-border-hover)" />
              </marker>
              <marker id="arrow-on" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--obs-accent)" />
              </marker>
            </defs>

            {Object.entries(EDGES).map(([key, [from, to]]) => {
              const on = activeEdges.has(key);
              return (
                <path
                  key={key}
                  d={edgePath(from, to)}
                  fill="none"
                  stroke={on ? "var(--obs-accent)" : "var(--obs-border-hover)"}
                  strokeWidth={on ? 2.4 : 1.2}
                  opacity={on ? 1 : 0.45}
                  markerEnd={on ? "url(#arrow-on)" : "url(#arrow-dim)"}
                  style={{ transition: "stroke 200ms, stroke-width 200ms, opacity 200ms" }}
                />
              );
            })}

            {Object.values(NODES).map((n) => {
              const touched = channel.edges.some((e) => {
                const [f, t] = EDGES[e];
                return NODES[f] === n || NODES[t] === n;
              });
              return (
                <g key={n.label}>
                  <rect
                    x={n.x - 64} y={n.y - 22} width={128} height={44} rx={9}
                    fill="var(--obs-surface-2)"
                    stroke={touched ? "var(--obs-accent)" : "var(--obs-border)"}
                    strokeWidth={touched ? 1.8 : 1}
                    style={{ transition: "stroke 200ms" }}
                  />
                  {n.label.split("\n").map((line, i, arr) => (
                    <text
                      key={i}
                      x={n.x}
                      y={n.y + (i - (arr.length - 1) / 2) * 13 + 4}
                      textAnchor="middle"
                      fontSize="12"
                      fontFamily="ui-monospace, monospace"
                      fill={touched ? "var(--obs-accent)" : "var(--obs-text)"}
                    >
                      {line}
                    </text>
                  ))}
                </g>
              );
            })}
          </svg>
        </div>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--obs-text)" }}>
          {channel.blurb}
        </p>
      </Card>

      <Card title="What each node looks like in real data" className="mt-4">
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
          {NODE_VARS.map((r) => (
            <div key={r.node} className="flex gap-2 items-baseline">
              <span className="font-mono text-xs shrink-0" style={{ color: "var(--obs-accent)" }}>{r.node}</span>
              <span style={{ color: "var(--obs-muted)" }}>→ {r.example}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// --- Step 3: central-bank scenarios ---------------------------------------

function MiniChart({
  title, data, dataKey, color, unit, target,
}: {
  title: string;
  data: { year: number; v: number }[];
  dataKey: string;
  color: string;
  unit: string;
  target?: number;
}) {
  const { theme } = useObservatoryTheme();
  const ct = useChartTheme(theme);
  return (
    <Card title={title}>
      <div className="h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 6, right: 12, bottom: 2, left: -8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={ct.grid} vertical={false} />
            <XAxis dataKey="year" tick={ct.tick} axisLine={{ stroke: ct.grid }} tickLine={false} interval="preserveStartEnd" />
            <YAxis tick={ct.tick} axisLine={false} tickLine={false} width={34} tickFormatter={(v) => `${v}`} />
            <Tooltip contentStyle={ct.tooltip} formatter={(v: number) => [`${v}${unit}`, ""]} labelFormatter={(l) => `Year ${l}`} />
            {target != null && <ReferenceLine y={target} stroke="var(--obs-muted)" strokeDasharray="4 4" />}
            <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2.2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

function Step3() {
  const [key, setKey] = useState<ScenarioKey>("real");
  const scenario = SCENARIOS.find((s) => s.key === key)!;

  const sim = useMemo(() => {
    const { exog, params } = buildScenario(key);
    return simulate(exog, params, 0);
  }, [key]);

  const infl = sim.years.map((y, i) => ({ year: y, v: sim.inflation[i] }));
  const unemp = sim.years.map((y, i) => ({ year: y, v: sim.unemployment[i] }));
  const rate = sim.years.map((y, i) => ({ year: y, v: sim.policyRate[i] }));

  return (
    <div>
      <p className="text-sm sm:text-base leading-relaxed max-w-3xl mb-5" style={{ color: "var(--obs-text)" }}>
        <strong style={{ color: "var(--obs-accent)" }}>Step 3.</strong> The same AI shock can look
        inflationary or disinflationary depending on expectations and how the central bank responds.
        Pick a story and watch three paths play out over ~12 years.
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {SCENARIOS.map((s) => {
          const on = s.key === key;
          return (
            <button
              key={s.key}
              onClick={() => setKey(s.key)}
              className="rounded-full px-3.5 py-1.5 text-xs font-mono border transition-colors"
              style={{
                borderColor: on ? "var(--obs-accent)" : "var(--obs-border)",
                color: on ? "var(--obs-accent)" : "var(--obs-muted)",
                backgroundColor: on ? "var(--obs-accent-dim)" : "transparent",
              }}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      <p className="text-sm leading-relaxed max-w-3xl mb-5" style={{ color: "var(--obs-muted)" }}>
        {scenario.blurb}
      </p>

      <div className="grid md:grid-cols-3 gap-5">
        <MiniChart title="Inflation (%)" data={infl} dataKey="v" color="var(--obs-c2)" unit="%" target={2} />
        <MiniChart title="Unemployment (%)" data={unemp} dataKey="v" color="var(--obs-c4)" unit="%" />
        <MiniChart title="Policy rate (%)" data={rate} dataKey="v" color="var(--obs-c3)" unit="%" />
      </div>
      <Caption>Dashed line on inflation marks the 2% target. Year 0 is the start of the shock. These are illustrative model paths, not predictions.</Caption>

      <Details summary="Details · the model behind the scenarios">
        <p>A compact, deterministic New-Keynesian-style system, one step per year:</p>
        <Eq>πₑ = ω·π* + (1−ω)·π₋₁</Eq>
        <Eq>y = ρ·y₋₁ + invest − σ·(i₋₁ − π₋₁ − r*)</Eq>
        <Eq>π = πₑ + κ·y − λ·g</Eq>
        <Eq>i = max(0, r* + π* + φπ·(π − π*) + φy·y)</Eq>
        <Eq>u = u* − Okun·y</Eq>
        <p className="mt-2">
          <strong>g</strong> is the productivity growth delivered by AI each year (a logistic adoption path),
          and <strong>invest</strong> is the demand boost from the AI build-out. The cost channel enters
          through <em>−λ·g</em> (productivity pulls inflation down); the demand channel enters through{" "}
          <em>invest</em>. The three scenarios differ only in those two input paths and how anchored
          expectations are (ω):
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li><strong>Real gains:</strong> high g, low ω (expectations slow to adjust) → disinflation, easing.</li>
          <li><strong>Hype then real:</strong> early investment hump, then g arrives → inflation up then down.</li>
          <li><strong>Hype only:</strong> investment boom, ~zero g, then an unwind → inflation then unemployment.</li>
        </ul>
        <p className="mt-2">Parameters: κ=0.35, λ=0.7, ρ=0.55, σ=0.5, φπ=1.5, φy=0.3, Okun=0.5, r*=1, π*=2. Kept deliberately simple and readable in <code>model.ts</code>.</p>
      </Details>
    </div>
  );
}

// --- assembled section -----------------------------------------------------

export default function Walkthrough({ data, country }: { data: ObservatoryData | null; country: string }) {
  return (
    <Section id="walkthrough" eyebrow="1 · Walkthrough" title="From task gains to economy-wide prices">
      <div className="space-y-16">
        <Step1 data={data} country={country} />
        <div>
          <p className="text-sm sm:text-base leading-relaxed max-w-3xl mb-6" style={{ color: "var(--obs-text)" }}>
            <strong style={{ color: "var(--obs-accent)" }}>Step 2.</strong> If gains do show up, they reach prices
            through more than one channel — and the channels can point in opposite directions. Toggle each one to
            light up the path it travels.
          </p>
          <FlowDiagram />
        </div>
        <Step3 />
      </div>
    </Section>
  );
}

function round(v: number) {
  return Math.round(v * 100) / 100;
}
