import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  ResponsiveContainer, Tooltip,
  ScatterChart, Scatter, XAxis, YAxis, Cell, ReferenceLine,
} from "recharts";
import { useVerdictTheme } from "./VerdictLayout";
import { fetchCase, TIER_COLORS, TIER_BG, type VerdictCase } from "./types";

function TierBadge({ tier }: { tier: string }) {
  return (
    <span
      className="text-[0.65rem] font-mono font-bold tracking-widest px-2 py-0.5 rounded uppercase"
      style={{
        color: TIER_COLORS[tier] ?? "var(--verdict-muted)",
        backgroundColor: TIER_BG[tier] ?? "transparent",
        border: `1px solid ${TIER_COLORS[tier] ?? "var(--verdict-border)"}`,
      }}
    >
      {tier}
    </span>
  );
}

function FactorRadarChart({ scores }: { scores: { LI: number; SE: number; ER: number; SF: number; PS: number } }) {
  const { theme } = useVerdictTheme();
  const data = [
    { factor: "LI", value: scores.LI, fullMark: 10 },
    { factor: "SE", value: scores.SE, fullMark: 10 },
    { factor: "ER", value: scores.ER, fullMark: 10 },
    { factor: "SF", value: scores.SF, fullMark: 10 },
    { factor: "PS", value: scores.PS, fullMark: 10 },
  ];

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
          <PolarGrid stroke="var(--verdict-border)" />
          <PolarAngleAxis
            dataKey="factor"
            tick={{ fill: "var(--verdict-muted)", fontSize: 11, fontFamily: "monospace", fontWeight: 600 }}
          />
          <Radar
            name="Score"
            dataKey="value"
            stroke="var(--verdict-accent)"
            fill="var(--verdict-accent)"
            fillOpacity={0.15}
            isAnimationActive
            animationBegin={0}
            animationDuration={700}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: theme === "dark" ? "#131929" : "#fff",
              border: "1px solid var(--verdict-border)",
              borderRadius: "6px",
              fontSize: "12px",
              fontFamily: "monospace",
              color: "var(--verdict-text)",
            }}
            formatter={(value: number) => [value.toFixed(0), "Score"]}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

function UncertaintyChart({
  edi,
  scenarioScores,
}: {
  edi: number;
  scenarioScores: { conservative: number; structural: number; balanced: number };
}) {
  const { theme } = useVerdictTheme();

  const points = [
    { label: "C", value: scenarioScores.conservative, name: "Conservative" },
    { label: "B", value: scenarioScores.balanced, name: "Balanced" },
    { label: "S", value: scenarioScores.structural, name: "Structural" },
    { label: "EDI", value: edi, name: "EDI (base)" },
  ];

  const data = points.map((p) => ({ x: p.value, y: 1, label: p.label, name: p.name }));

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { payload: typeof data[0] }[] }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div
        className="rounded border px-3 py-2 text-xs font-mono"
        style={{
          backgroundColor: theme === "dark" ? "#131929" : "#fff",
          borderColor: "var(--verdict-border)",
          color: "var(--verdict-text)",
        }}
      >
        <div style={{ color: "var(--verdict-muted)" }}>{d.name}</div>
        <div style={{ color: "var(--verdict-accent)" }}>{d.x.toFixed(2)}</div>
      </div>
    );
  };

  return (
    <div className="h-24">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 20 }}>
          <XAxis
            dataKey="x"
            type="number"
            domain={[1, 10]}
            tick={{ fill: "var(--verdict-muted)", fontSize: 10, fontFamily: "monospace" }}
            axisLine={{ stroke: "var(--verdict-border)" }}
            tickLine={false}
            ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
          />
          <YAxis dataKey="y" hide />
          <ReferenceLine
            x={edi}
            stroke="var(--verdict-accent)"
            strokeDasharray="3 3"
            strokeWidth={1.5}
          />
          <Tooltip content={<CustomTooltip />} />
          <Scatter data={data} isAnimationActive animationDuration={500}>
            {data.map((entry, idx) => (
              <Cell
                key={idx}
                fill={entry.label === "EDI" ? "var(--verdict-accent)" : "var(--verdict-muted)"}
                opacity={entry.label === "EDI" ? 1 : 0.6}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function VerdictCasePage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<VerdictCase | null>(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useVerdictTheme();

  useEffect(() => {
    if (!id) return;
    fetchCase(parseInt(id, 10)).then((c) => { setItem(c); setLoading(false); });
  }, [id]);

  if (loading) {
    return (
      <div className="py-16 text-center text-sm font-mono" style={{ color: "var(--verdict-muted)" }}>
        Loading…
      </div>
    );
  }

  if (!item) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm font-mono mb-4" style={{ color: "var(--verdict-muted)" }}>Case not found.</p>
        <Link to="/mini/verdict" className="text-sm" style={{ color: "var(--verdict-accent)" }}>← All cases</Link>
      </div>
    );
  }

  const { computed, scores } = item;
  const band = computed.uncertainty_band;

  const sectionClass = "rounded-lg border p-5 mb-5";
  const sectionStyle = {
    backgroundColor: "var(--verdict-surface)",
    borderColor: "var(--verdict-border)",
  };

  const labelStyle = "text-[0.65rem] font-mono tracking-widest uppercase mb-1";
  const labelColor = { color: "var(--verdict-muted)" };

  return (
    <div>
      {/* Back */}
      <div className="mb-6">
        <Link
          to="/mini/verdict"
          className="text-xs font-mono transition-opacity hover:opacity-80"
          style={{ color: "var(--verdict-accent)" }}
        >
          ← All cases
        </Link>
      </div>

      {/* Header */}
      <div className={sectionClass} style={sectionStyle}>
        <div className="flex items-start justify-between gap-6 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <TierBadge tier={computed.tier} />
              <span
                className="text-[0.65rem] font-mono tracking-wider uppercase px-2 py-0.5 rounded"
                style={{ color: "var(--verdict-muted)", backgroundColor: "var(--verdict-surface-2)" }}
              >
                {item.decision_type}
              </span>
              <span
                className="text-[0.65rem] font-mono tracking-wider uppercase px-2 py-0.5 rounded"
                style={{ color: "var(--verdict-muted)", backgroundColor: "var(--verdict-surface-2)" }}
              >
                {item.jurisdiction}
              </span>
            </div>
            <h1
              className="text-xl font-bold leading-snug mb-2"
              style={{ color: "var(--verdict-text)" }}
            >
              {item.title}
            </h1>
            <time className="text-xs font-mono" style={{ color: "var(--verdict-muted)" }}>
              {new Date(item.date).toLocaleDateString("en-SG", { year: "numeric", month: "long", day: "numeric" })}
            </time>
          </div>

          {/* EDI score */}
          <div className="text-right shrink-0">
            <div className="text-[0.65rem] font-mono tracking-widest mb-1" style={{ color: "var(--verdict-muted)" }}>
              EDI SCORE
            </div>
            <div
              className="text-5xl font-mono font-bold leading-none"
              style={{ color: "var(--verdict-accent)" }}
            >
              {computed.EDI.toFixed(1)}
            </div>
            <div className="text-[0.6rem] font-mono mt-1" style={{ color: "var(--verdict-muted)" }}>
              [{band[0].toFixed(1)}, {band[1].toFixed(1)}]
            </div>
          </div>
        </div>

        <p className="text-sm leading-relaxed" style={{ color: "var(--verdict-muted)" }}>
          {item.summary}
        </p>
      </div>

      {/* Two dimensions */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className={sectionClass} style={{ ...sectionStyle, margin: 0 }}>
          <div className={labelStyle} style={labelColor}>Disruption Potential (DP)</div>
          <div className="text-3xl font-mono font-bold" style={{ color: "var(--verdict-accent)" }}>
            {computed.DP.toFixed(2)}
          </div>
          <p className="text-xs leading-relaxed mt-2" style={{ color: "var(--verdict-muted)" }}>
            Legal instrument strength (LI) × 0.55 + societal effect (SE) × 0.45. Measures how forceful the legal action is and how broadly it touches everyday life.
          </p>
        </div>
        <div className={sectionClass} style={{ ...sectionStyle, margin: 0 }}>
          <div className={labelStyle} style={labelColor}>Distributional Reach (DR)</div>
          <div className="text-3xl font-mono font-bold" style={{ color: "var(--verdict-accent)" }}>
            {computed.DR.toFixed(2)}
          </div>
          <p className="text-xs leading-relaxed mt-2" style={{ color: "var(--verdict-muted)" }}>
            Economic reach (ER) × 0.40 + structural force (SF) × 0.35 + political salience (PS) × 0.25. Measures how widely the decision's effects propagate through markets and institutions.
          </p>
        </div>
      </div>

      {/* Factor radar */}
      <div className={sectionClass} style={sectionStyle}>
        <div className={labelStyle} style={labelColor}>Five-factor profile</div>
        <div className="flex items-start gap-6">
          <div className="flex-1">
            <FactorRadarChart scores={scores} />
          </div>
          <div className="shrink-0 space-y-2 text-xs font-mono pt-4">
            {[
              { key: "LI", label: "Legal Instrument", value: scores.LI },
              { key: "SE", label: "Societal Effect", value: scores.SE },
              { key: "ER", label: "Economic Reach", value: scores.ER },
              { key: "SF", label: "Structural Force", value: scores.SF },
              { key: "PS", label: "Political Salience", value: scores.PS },
            ].map(({ key, label, value }) => (
              <div key={key} className="flex items-center gap-3">
                <span className="w-6 text-right font-bold" style={{ color: "var(--verdict-accent)" }}>{key}</span>
                <div
                  className="w-20 h-1.5 rounded-full overflow-hidden"
                  style={{ backgroundColor: "var(--verdict-border)" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${value * 10}%`,
                      backgroundColor: "var(--verdict-accent)",
                    }}
                  />
                </div>
                <span style={{ color: "var(--verdict-text)" }}>{value}</span>
                <span style={{ color: "var(--verdict-muted)" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Uncertainty band */}
      <div className={sectionClass} style={sectionStyle}>
        <div className={labelStyle} style={labelColor}>Sensitivity analysis — scenario EDI scores</div>
        <UncertaintyChart edi={computed.EDI} scenarioScores={computed.scenario_scores} />
        <div className="flex items-center gap-6 mt-2 text-xs font-mono" style={{ color: "var(--verdict-muted)" }}>
          <span>C = Conservative (ER-weighted)</span>
          <span>B = Balanced (equal weights)</span>
          <span>S = Structural (DP-weighted)</span>
        </div>
        <div className="mt-3 text-xs" style={{ color: "var(--verdict-muted)" }}>
          Uncertainty band: [{band[0].toFixed(1)}, {band[1].toFixed(1)}].
          {band[0] === band[1]
            ? " Single case — band collapses to a point. Will widen as more cases are added."
            : " Width reflects sensitivity to different weighting assumptions."}
        </div>
      </div>

      {/* Economic consequence */}
      <div className={sectionClass} style={sectionStyle}>
        <div className={labelStyle} style={labelColor}>Economic consequence</div>
        <p className="text-sm leading-relaxed" style={{ color: "var(--verdict-text)" }}>
          {item.economic_consequence}
        </p>
      </div>

      {/* Legal mechanism */}
      <div className={sectionClass} style={sectionStyle}>
        <div className={labelStyle} style={labelColor}>Legal mechanism</div>
        <p className="text-sm leading-relaxed" style={{ color: "var(--verdict-text)" }}>
          {item.legal_mechanism}
        </p>
      </div>

      {/* Sources */}
      {item.sources.length > 0 && (
        <div className={sectionClass} style={sectionStyle}>
          <div className={labelStyle} style={labelColor}>Sources</div>
          <ul className="space-y-1">
            {item.sources.map((src, i) => (
              <li key={i}>
                <a
                  href={src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono transition-opacity hover:opacity-80 underline underline-offset-2"
                  style={{ color: "var(--verdict-accent)" }}
                >
                  {src}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Contributor */}
      {item.contributor && (
        <div className="text-xs font-mono text-right" style={{ color: "var(--verdict-muted)" }}>
          Contributed by {item.contributor}
        </div>
      )}
    </div>
  );
}
