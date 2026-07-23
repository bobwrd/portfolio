import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
  Cell,
} from "recharts";
import { Section, Card, Caption, Details, useChartTheme } from "../shared";
import { useDocketTheme } from "../DocketLayout";
import { statePending, trendData, courtLevels } from "../model";

// Recharts tooltip style wrapper — matches the docket palette.
function DocketTooltip({
  active,
  payload,
  label,
  formatter,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
  formatter?: (val: number) => string;
}) {
  const { theme } = useDocketTheme();
  if (!active || !payload?.length) return null;
  const bg = theme === "dark" ? "#121e12" : "#ffffff";
  return (
    <div
      className="rounded-lg border px-3 py-2 text-xs font-mono shadow-lg"
      style={{ backgroundColor: bg, borderColor: "var(--docket-border)", color: "var(--docket-text)" }}
    >
      <div className="mb-1 font-semibold">{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ color: p.color }}>
          {p.name}: {formatter ? formatter(p.value) : p.value}
        </div>
      ))}
    </div>
  );
}

type StateView = "total" | "civil" | "criminal";
type TrendView = "total" | "breakdown";

export default function BacklogMap() {
  const { theme } = useDocketTheme();
  const ct = useChartTheme(theme);
  const [stateView, setStateView] = useState<StateView>("total");
  const [trendView, setTrendView] = useState<TrendView>("total");

  // Sort states by pending desc, take top 15
  const stateChartData = [...statePending]
    .sort((a, b) => b.pending - a.pending)
    .slice(0, 15)
    .map((s) => ({
      state: s.state.replace(" Pradesh", " P.").replace("West Bengal", "W. Bengal"),
      total: s.pending,
      civil: Math.round((s.pending * s.civilPct) / 100),
      criminal: Math.round((s.pending * s.criminalPct) / 100),
    }));

  // Court level bar data
  const levelData = courtLevels.map((c) => ({
    level: c.shortLabel,
    vacancyPct: c.vacancyPct,
    avgDisposal: c.avgDisposalYears,
    disposalRate: c.disposalRate,
  }));

  const toggleTab = (
    val: string,
    current: string,
    set: (v: string) => void,
    options: string[]
  ) => {
    const idx = (options.indexOf(current) + 1) % options.length;
    set(options[idx]);
    void val;
  };

  return (
    <Section id="backlog" eyebrow="Chapter 1 · The Docket" title="Where are the 49 million cases?">
      {/* Court-level summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {courtLevels.map((c) => (
          <Card key={c.level}>
            <div className="text-xs font-mono mb-1" style={{ color: "var(--docket-muted)" }}>
              {c.shortLabel}
            </div>
            <div className="text-3xl font-bold font-mono" style={{ color: "var(--docket-accent)" }}>
              {c.pendingUnit === "M"
                ? `${c.pending.toFixed(1)}M`
                : `${c.pending}K`}
            </div>
            <div className="text-xs mt-1 mb-3" style={{ color: "var(--docket-muted)" }}>
              pending cases
            </div>
            <div className="space-y-1 text-xs" style={{ color: "var(--docket-muted)" }}>
              <div className="flex justify-between">
                <span>Judge vacancy</span>
                <span
                  style={{
                    color:
                      c.vacancyPct > 25
                        ? "var(--docket-crit)"
                        : c.vacancyPct > 15
                        ? "var(--docket-high)"
                        : "var(--docket-mod)",
                  }}
                >
                  {c.vacancyPct.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Avg case duration</span>
                <span style={{ color: "var(--docket-text)" }}>{c.avgDisposalYears} yrs</span>
              </div>
              <div className="flex justify-between">
                <span>Annual disposal rate</span>
                <span style={{ color: "var(--docket-text)" }}>{c.disposalRate}%</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* State-level bar chart */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold" style={{ color: "var(--docket-text)" }}>
            Pending cases by state (top 15, district courts)
          </h3>
          <div className="flex gap-1">
            {(["total", "civil", "criminal"] as StateView[]).map((v) => (
              <button
                key={v}
                onClick={() => setStateView(v)}
                className="px-2.5 py-1 rounded text-xs font-mono transition-all border"
                style={{
                  backgroundColor: stateView === v ? "var(--docket-accent-dim)" : "transparent",
                  borderColor: stateView === v ? "var(--docket-accent)" : "var(--docket-border)",
                  color: stateView === v ? "var(--docket-accent)" : "var(--docket-muted)",
                }}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <div style={{ width: "100%", height: 380 }}>
          <ResponsiveContainer>
            <BarChart
              data={stateChartData}
              layout="vertical"
              margin={{ top: 4, right: 24, bottom: 4, left: 80 }}
            >
              <CartesianGrid
                horizontal={false}
                stroke={ct.grid}
                strokeDasharray="3 3"
                strokeOpacity={0.5}
              />
              <XAxis
                type="number"
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                tick={ct.tick}
              />
              <YAxis
                type="category"
                dataKey="state"
                tick={{ ...ct.tick, fontSize: 10 }}
                width={78}
              />
              <Tooltip
                content={
                  <DocketTooltip
                    formatter={(v) => `${(v / 1000).toFixed(1)}K`}
                  />
                }
              />
              {stateView === "total" && (
                <Bar dataKey="total" name="Pending" radius={[0, 3, 3, 0]} maxBarSize={18}>
                  {stateChartData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={
                        entry.total > 4000
                          ? "var(--docket-crit)"
                          : entry.total > 2000
                          ? "var(--docket-high)"
                          : entry.total > 1000
                          ? "var(--docket-mod)"
                          : "var(--docket-accent)"
                      }
                      fillOpacity={0.85}
                    />
                  ))}
                </Bar>
              )}
              {stateView === "civil" && (
                <Bar
                  dataKey="civil"
                  name="Civil"
                  fill="var(--docket-accent)"
                  fillOpacity={0.85}
                  radius={[0, 3, 3, 0]}
                  maxBarSize={18}
                />
              )}
              {stateView === "criminal" && (
                <Bar
                  dataKey="criminal"
                  name="Criminal"
                  fill="var(--docket-high)"
                  fillOpacity={0.85}
                  radius={[0, 3, 3, 0]}
                  maxBarSize={18}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
        <Caption>
          Source: NJDG (National Judicial Data Grid), aggregated state data, approx. 2023-24.
          Figures in thousands. Colour intensity indicates severity tier.
        </Caption>
      </div>

      {/* Trend over time */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold" style={{ color: "var(--docket-text)" }}>
            Total pending cases over time (all courts, millions)
          </h3>
          <div className="flex gap-1">
            {(["total", "breakdown"] as TrendView[]).map((v) => (
              <button
                key={v}
                onClick={() => setTrendView(v)}
                className="px-2.5 py-1 rounded text-xs font-mono transition-all border"
                style={{
                  backgroundColor: trendView === v ? "var(--docket-accent-dim)" : "transparent",
                  borderColor: trendView === v ? "var(--docket-accent)" : "var(--docket-border)",
                  color: trendView === v ? "var(--docket-accent)" : "var(--docket-muted)",
                }}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <div style={{ width: "100%", height: 280 }}>
          <ResponsiveContainer>
            <LineChart
              data={trendData}
              margin={{ top: 4, right: 16, bottom: 4, left: 0 }}
            >
              <CartesianGrid stroke={ct.grid} strokeDasharray="3 3" strokeOpacity={0.5} />
              <XAxis dataKey="year" tick={ct.tick} />
              <YAxis
                tickFormatter={(v) => `${v}M`}
                tick={ct.tick}
                domain={[0, "auto"]}
              />
              <Tooltip
                content={
                  <DocketTooltip
                    formatter={(v) => `${v.toFixed(1)}M`}
                  />
                }
              />
              {trendView === "total" && (
                <Line
                  type="monotone"
                  dataKey="total"
                  name="All courts"
                  stroke="var(--docket-accent)"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "var(--docket-accent)" }}
                  activeDot={{ r: 5 }}
                />
              )}
              {trendView === "breakdown" && (
                <>
                  <Line
                    type="monotone"
                    dataKey="district"
                    name="District courts"
                    stroke="var(--docket-accent)"
                    strokeWidth={2}
                    dot={{ r: 2, fill: "var(--docket-accent)" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="highCourt"
                    name="High Courts"
                    stroke="var(--docket-high)"
                    strokeWidth={2}
                    dot={{ r: 2, fill: "var(--docket-high)" }}
                    strokeDasharray="4 2"
                  />
                  <Legend
                    wrapperStyle={{ color: "var(--docket-muted)", fontSize: 11, fontFamily: "monospace" }}
                  />
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <Caption>
          Note: 2020 spike reflects COVID-19 court closures causing filing backlog. 2024 figure is
          provisional. Source: eCourts project annual reports; NJDG historical data.
        </Caption>
      </div>

      {/* Civil vs criminal visual breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <Card title="Case type split (district courts, approx.)">
          <div className="flex flex-col gap-3 mt-2">
            {[
              { label: "Criminal cases", pct: 59, color: "var(--docket-high)" },
              { label: "Civil cases", pct: 41, color: "var(--docket-accent)" },
            ].map(({ label, pct, color }) => (
              <div key={label}>
                <div className="flex justify-between text-xs mb-1" style={{ color: "var(--docket-muted)" }}>
                  <span>{label}</span>
                  <span style={{ color }}>{pct}%</span>
                </div>
                <div
                  className="h-2 rounded-full overflow-hidden"
                  style={{ backgroundColor: "var(--docket-surface-2)" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, backgroundColor: color, opacity: 0.85 }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs mt-4" style={{ color: "var(--docket-muted)" }}>
            Criminal cases dominate numerically but civil cases have longer average pendency.
            High Courts skew more civil (~50:50).
          </p>
        </Card>

        <Card title="Filing vs disposal gap (2024, district courts)">
          <div className="flex flex-col gap-3 mt-2">
            {[
              { label: "Cases filed annually", val: "21.4M", pct: 100, color: "var(--docket-accent)" },
              { label: "Cases disposed annually", val: "19.2M", pct: 90, color: "var(--docket-mod)" },
              { label: "Net annual accumulation", val: "+2.2M", pct: 10, color: "var(--docket-crit)" },
            ].map(({ label, val, pct, color }) => (
              <div key={label}>
                <div className="flex justify-between text-xs mb-1" style={{ color: "var(--docket-muted)" }}>
                  <span>{label}</span>
                  <span style={{ color, fontFamily: "monospace" }}>{val}</span>
                </div>
                <div
                  className="h-2 rounded-full overflow-hidden"
                  style={{ backgroundColor: "var(--docket-surface-2)" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, backgroundColor: color, opacity: 0.85 }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs mt-4" style={{ color: "var(--docket-muted)" }}>
            Courts dispose of ~90% of what they file each year, but the existing stockpile
            grows because disposal cannot clear the accumulated backlog.
          </p>
        </Card>
      </div>

      <Details summary="Data sources and caveats">
        <p className="mb-2">
          <strong>NJDG (National Judicial Data Grid)</strong>: The primary source for state-level
          and court-level pending case counts. Publicly accessible at njdg.gov.in. Data is updated
          regularly but not in real time. Figures here are approximate as of late 2023.
        </p>
        <p className="mb-2">
          <strong>Ministry of Law &amp; Justice Annual Reports</strong>: Used for judge strength
          data (sanctioned vs actual positions) and High Court statistics.
        </p>
        <p className="mb-2">
          <strong>eCourts Mission Mode Project</strong>: Annual progress reports provide
          digitalization and e-filing adoption data.
        </p>
        <p>
          <strong>Rounding and uncertainty</strong>: State figures are rounded to the nearest
          thousand. Trend data before 2019 is reconstructed from multiple reports and may vary by
          ±3-5%. The 2020 figure reflects the COVID-19 effect on court operations.
        </p>
      </Details>
    </Section>
  );
}
