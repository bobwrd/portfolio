import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Cell,
  BarChart, Bar, ErrorBar, ResponsiveContainer, LabelList,
  CartesianGrid, ReferenceLine,
} from "recharts";
import { useVerdictTheme } from "./VerdictLayout";
import { fetchCases, TIER_COLORS, type VerdictCase } from "./types";

export default function VerdictCharts() {
  const [cases, setCases] = useState<VerdictCase[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useVerdictTheme();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCases().then((data) => { setCases(data); setLoading(false); });
  }, []);

  const tooltipStyle = {
    backgroundColor: theme === "dark" ? "#131929" : "#fff",
    border: "1px solid var(--verdict-border)",
    borderRadius: "6px",
    fontSize: "12px",
    fontFamily: "monospace",
    color: "var(--verdict-text)",
  };

  const axisProps = {
    tick: { fill: "var(--verdict-muted)", fontSize: 10, fontFamily: "monospace" },
    axisLine: { stroke: "var(--verdict-border)" },
    tickLine: false,
  };

  // Scatter data: DP vs DR, sized by EDI
  const scatterData = cases.map((c) => ({
    x: c.computed.DP,
    y: c.computed.DR,
    z: c.computed.EDI * 8,
    title: c.title,
    tier: c.computed.tier,
    edi: c.computed.EDI,
    id: c.case_id,
  }));

  // Bar chart data: ranked by EDI
  const barData = [...cases]
    .sort((a, b) => b.computed.EDI - a.computed.EDI)
    .map((c) => ({
      name: c.title.length > 30 ? c.title.slice(0, 28) + "…" : c.title,
      EDI: c.computed.EDI,
      tier: c.computed.tier,
      id: c.case_id,
      band: [
        c.computed.EDI - c.computed.uncertainty_band[0],
        c.computed.uncertainty_band[1] - c.computed.EDI,
      ],
    }));

  const ScatterTooltip = ({ active, payload }: { active?: boolean; payload?: { payload: typeof scatterData[0] }[] }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div className="rounded border p-3 text-xs font-mono" style={tooltipStyle}>
        <div style={{ color: TIER_COLORS[d.tier] }} className="font-bold mb-1">{d.tier}</div>
        <div className="max-w-[200px] leading-snug mb-2" style={{ color: "var(--verdict-text)" }}>{d.title}</div>
        <div style={{ color: "var(--verdict-muted)" }}>DP: <span style={{ color: "var(--verdict-accent)" }}>{d.x.toFixed(2)}</span></div>
        <div style={{ color: "var(--verdict-muted)" }}>DR: <span style={{ color: "var(--verdict-accent)" }}>{d.y.toFixed(2)}</span></div>
        <div style={{ color: "var(--verdict-muted)" }}>EDI: <span style={{ color: "var(--verdict-accent)" }}>{d.edi.toFixed(1)}</span></div>
        <div className="mt-1 text-[0.65rem]" style={{ color: "var(--verdict-muted)" }}>Click to view case →</div>
      </div>
    );
  };

  const BarTooltip = ({ active, payload }: { active?: boolean; payload?: { payload: typeof barData[0] }[] }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div className="rounded border p-3 text-xs font-mono" style={tooltipStyle}>
        <div style={{ color: TIER_COLORS[d.tier] }} className="font-bold mb-1">{d.tier}</div>
        <div className="max-w-[200px] leading-snug mb-1" style={{ color: "var(--verdict-text)" }}>{d.name}</div>
        <div style={{ color: "var(--verdict-muted)" }}>EDI: <span style={{ color: "var(--verdict-accent)" }}>{d.EDI.toFixed(1)}</span></div>
      </div>
    );
  };

  const sectionClass = "rounded-lg border p-5 mb-8";
  const sectionStyle = {
    backgroundColor: "var(--verdict-surface)",
    borderColor: "var(--verdict-border)",
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-sm font-mono" style={{ color: "var(--verdict-muted)" }}>
        Loading…
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-2" style={{ color: "var(--verdict-text)" }}>
          Analytics
        </h1>
        <p className="text-sm" style={{ color: "var(--verdict-muted)" }}>
          Cross-case visualisations. More cases produce richer distributions.
        </p>
      </div>

      {/* Scatter: DP vs DR */}
      <div className={sectionClass} style={sectionStyle}>
        <div className="text-[0.65rem] font-mono tracking-widest uppercase mb-1" style={{ color: "var(--verdict-muted)" }}>
          Disruption Potential vs Distributional Reach
        </div>
        <p className="text-xs mb-4 leading-relaxed" style={{ color: "var(--verdict-muted)" }}>
          Each dot is a case. X axis: DP (how forceful + societal). Y axis: DR (economic + structural + political). Dot size scales with EDI. Click a dot to open the case.
        </p>
        {scatterData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-xs font-mono" style={{ color: "var(--verdict-muted)" }}>
            No data yet.
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 30, bottom: 30, left: 30 }}>
                <CartesianGrid stroke="var(--verdict-border)" strokeDasharray="3 3" opacity={0.4} />
                <XAxis
                  dataKey="x"
                  type="number"
                  domain={[0, 11]}
                  name="DP"
                  label={{ value: "DP", position: "bottom", offset: 10, fill: "var(--verdict-muted)", fontSize: 10, fontFamily: "monospace" }}
                  {...axisProps}
                />
                <YAxis
                  dataKey="y"
                  type="number"
                  domain={[0, 11]}
                  name="DR"
                  label={{ value: "DR", angle: -90, position: "insideLeft", offset: 10, fill: "var(--verdict-muted)", fontSize: 10, fontFamily: "monospace" }}
                  {...axisProps}
                />
                <ZAxis dataKey="z" range={[60, 400]} />
                <ReferenceLine x={5} stroke="var(--verdict-border)" strokeDasharray="4 4" />
                <ReferenceLine y={5} stroke="var(--verdict-border)" strokeDasharray="4 4" />
                <Tooltip content={<ScatterTooltip />} />
                <Scatter
                  data={scatterData}
                  isAnimationActive
                  animationDuration={600}
                  onClick={(data) => navigate(`/verdict/${data.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  {scatterData.map((entry, idx) => (
                    <Cell key={idx} fill={TIER_COLORS[entry.tier] ?? "var(--verdict-accent)"} fillOpacity={0.85} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Bar: cases ranked by EDI */}
      <div className={sectionClass} style={sectionStyle}>
        <div className="text-[0.65rem] font-mono tracking-widest uppercase mb-1" style={{ color: "var(--verdict-muted)" }}>
          Cases ranked by EDI
        </div>
        <p className="text-xs mb-4 leading-relaxed" style={{ color: "var(--verdict-muted)" }}>
          Horizontal bars ranked by EDI. Error bars show the uncertainty band [min scenario, max scenario]. Coloured by tier.
        </p>
        {barData.length === 0 ? (
          <div className="h-40 flex items-center justify-center text-xs font-mono" style={{ color: "var(--verdict-muted)" }}>
            No data yet.
          </div>
        ) : (
          <div style={{ height: Math.max(120, barData.length * 52 + 40) }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                layout="vertical"
                margin={{ top: 5, right: 60, bottom: 5, left: 10 }}
              >
                <CartesianGrid
                  horizontal={false}
                  stroke="var(--verdict-border)"
                  strokeDasharray="3 3"
                  opacity={0.4}
                />
                <XAxis
                  type="number"
                  domain={[0, 10]}
                  ticks={[0, 2, 4, 6, 8, 10]}
                  {...axisProps}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={180}
                  tick={{ fill: "var(--verdict-muted)", fontSize: 10, fontFamily: "monospace" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<BarTooltip />} />
                <Bar dataKey="EDI" isAnimationActive animationDuration={600} radius={[0, 3, 3, 0]}>
                  <ErrorBar dataKey="band" width={4} strokeWidth={1.5} stroke="var(--verdict-muted)" />
                  <LabelList
                    dataKey="EDI"
                    position="right"
                    formatter={(v: number) => v.toFixed(1)}
                    style={{ fill: "var(--verdict-muted)", fontSize: 10, fontFamily: "monospace" }}
                  />
                  {barData.map((entry, idx) => (
                    <Cell key={idx} fill={TIER_COLORS[entry.tier] ?? "var(--verdict-accent)"} fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
