import { useState } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Section, Card, Details, Caption, TierBadge, useChartTheme } from "../shared";
import { useDocketTheme } from "../DocketLayout";
import { bottleneckData, type BottleneckEntry } from "../model";

type SortKey = "composite" | "vacancyScore" | "digitalScore" | "adjournScore" | "pendencyScore" | "infraScore";

const FACTORS: { key: SortKey; label: string; short: string }[] = [
  { key: "vacancyScore",   label: "Judge vacancies",     short: "Vacancy" },
  { key: "digitalScore",   label: "Low digitalization",  short: "Digital gap" },
  { key: "adjournScore",   label: "Adjournments",        short: "Adjourn" },
  { key: "pendencyScore",  label: "Case age",            short: "Age" },
  { key: "infraScore",     label: "Infrastructure gap",  short: "Infra" },
];

function ScoreBar({ value, max = 100 }: { value: number; max?: number }) {
  const pct = (value / max) * 100;
  const color =
    value >= 75 ? "var(--docket-crit)"
    : value >= 60 ? "var(--docket-high)"
    : value >= 45 ? "var(--docket-mod)"
    : "var(--docket-low)";
  return (
    <div className="flex items-center gap-2">
      <div
        className="flex-1 h-1.5 rounded-full overflow-hidden"
        style={{ backgroundColor: "var(--docket-surface-2)" }}
      >
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, backgroundColor: color, opacity: 0.85 }}
        />
      </div>
      <span className="text-xs font-mono w-6 text-right" style={{ color }}>
        {value}
      </span>
    </div>
  );
}

export default function Bottlenecks() {
  const { theme } = useDocketTheme();
  const ct = useChartTheme(theme);
  const [sortBy, setSortBy] = useState<SortKey>("composite");
  const [selected, setSelected] = useState<BottleneckEntry | null>(bottleneckData[0]);

  const sorted = [...bottleneckData].sort((a, b) => b[sortBy] - a[sortBy]);

  // Radar data for selected state
  const radarData = selected
    ? FACTORS.map((f) => ({
        factor: f.short,
        value: selected[f.key],
        fullMark: 100,
      }))
    : [];

  return (
    <Section
      id="bottlenecks"
      eyebrow="Chapter 2 · The Docket"
      title="Where the delays come from"
    >
      <p className="text-sm sm:text-base mb-8 max-w-2xl" style={{ color: "var(--docket-muted)" }}>
        Five structural factors drive most of the backlog: vacant judgeships, low digitalization,
        routine adjournments, accumulated case age, and infrastructure deficits. Each state is
        scored 0–100 per factor (higher = worse), then combined into a Backlog Severity Index
        (BSI). Select a state to see its radar profile.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Scoring table */}
        <div className="lg:col-span-2 overflow-x-auto">
          <div className="flex gap-2 mb-3 flex-wrap">
            <span className="text-xs font-mono" style={{ color: "var(--docket-muted)" }}>
              Sort by:
            </span>
            {[{ key: "composite" as SortKey, label: "BSI" }, ...FACTORS.map((f) => ({ key: f.key, label: f.short }))].map(
              ({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setSortBy(key)}
                  className="px-2 py-0.5 rounded text-xs font-mono border transition-all"
                  style={{
                    borderColor: sortBy === key ? "var(--docket-accent)" : "var(--docket-border)",
                    color: sortBy === key ? "var(--docket-accent)" : "var(--docket-muted)",
                    backgroundColor: sortBy === key ? "var(--docket-accent-dim)" : "transparent",
                  }}
                >
                  {label}
                </button>
              )
            )}
          </div>

          <table className="w-full text-xs border-separate" style={{ borderSpacing: "0 3px" }}>
            <thead>
              <tr style={{ color: "var(--docket-muted)" }}>
                <th className="text-left pb-2 font-mono font-normal">State</th>
                {FACTORS.map((f) => (
                  <th key={f.key} className="text-right pb-2 font-mono font-normal hidden sm:table-cell">
                    {f.short}
                  </th>
                ))}
                <th className="text-right pb-2 font-mono font-normal">BSI</th>
                <th className="pb-2"></th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((row) => {
                const isSelected = selected?.state === row.state;
                return (
                  <tr
                    key={row.state}
                    onClick={() => setSelected(row)}
                    className="cursor-pointer transition-colors"
                    style={{
                      backgroundColor: isSelected ? "var(--docket-accent-dim)" : "transparent",
                    }}
                  >
                    <td
                      className="py-1.5 pl-2 rounded-l font-medium"
                      style={{ color: isSelected ? "var(--docket-accent)" : "var(--docket-text)" }}
                    >
                      {row.state}
                    </td>
                    {FACTORS.map((f) => (
                      <td
                        key={f.key}
                        className="text-right py-1.5 font-mono hidden sm:table-cell"
                        style={{ color: "var(--docket-muted)" }}
                      >
                        {row[f.key]}
                      </td>
                    ))}
                    <td className="text-right py-1.5 font-mono font-bold pr-2" style={{ color: "var(--docket-text)" }}>
                      {row.composite.toFixed(0)}
                    </td>
                    <td className="text-right py-1.5 pr-2 rounded-r">
                      <TierBadge tier={row.tier} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <Caption>
            BSI = Backlog Severity Index. Scores are normalised to 0–100 within each factor.
            Click any row to see the factor breakdown radar.
          </Caption>
        </div>

        {/* Radar for selected state */}
        <div className="flex flex-col gap-4">
          {selected && (
            <Card title={`${selected.state} — Factor breakdown`}>
              <div style={{ width: "100%", height: 230 }}>
                <ResponsiveContainer>
                  <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                    <PolarGrid stroke="var(--docket-border)" />
                    <PolarAngleAxis
                      dataKey="factor"
                      tick={{ fill: "var(--docket-muted)", fontSize: 10, fontFamily: "monospace" }}
                    />
                    <Radar
                      name={selected.state}
                      dataKey="value"
                      stroke="var(--docket-accent)"
                      fill="var(--docket-accent)"
                      fillOpacity={0.25}
                      strokeWidth={1.5}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme === "dark" ? "#121e12" : "#fff",
                        border: "1px solid var(--docket-border)",
                        borderRadius: 6,
                        fontSize: 11,
                        fontFamily: "monospace",
                        color: "var(--docket-text)",
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-3 space-y-2">
                {FACTORS.map((f) => (
                  <div key={f.key}>
                    <div className="flex justify-between text-xs mb-0.5" style={{ color: "var(--docket-muted)" }}>
                      <span>{f.label}</span>
                    </div>
                    <ScoreBar value={selected[f.key]} />
                  </div>
                ))}
              </div>

              <div
                className="mt-4 pt-3 border-t text-xs"
                style={{ borderColor: "var(--docket-border)", color: "var(--docket-muted)" }}
              >
                Composite BSI:{" "}
                <span className="font-mono font-bold" style={{ color: "var(--docket-text)" }}>
                  {selected.composite.toFixed(1)}
                </span>{" "}
                — <TierBadge tier={selected.tier} />
              </div>
            </Card>
          )}

          {/* Tier legend */}
          <Card title="Tier definitions">
            <div className="space-y-2 text-xs" style={{ color: "var(--docket-muted)" }}>
              {(
                [
                  { tier: "Critical", range: "BSI ≥ 72", desc: "Multiple severe factors. Requires structural intervention." },
                  { tier: "High",     range: "BSI 60–71", desc: "Two or more high-impact factors. Targeted reforms needed." },
                  { tier: "Moderate", range: "BSI 45–59", desc: "Identifiable bottlenecks. Digital tools can help." },
                  { tier: "Low",      range: "BSI < 45",  desc: "Relatively better-managed. Efficiency gains still available." },
                ] as const
              ).map(({ tier, range, desc }) => (
                <div key={tier} className="flex gap-2">
                  <div className="shrink-0 pt-0.5">
                    <TierBadge tier={tier} />
                  </div>
                  <div>
                    <span className="font-mono">{range}</span> — {desc}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* What each bottleneck means */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {[
          {
            factor: "Judge vacancies",
            stat: "30.2%",
            statLabel: "of High Court seats empty",
            body: "India has ~21 judges per million people against the Law Commission's recommended minimum of 50. Vacancies in High Courts average 30% nationally; in some states district court vacancies exceed 40%. Each unfilled seat shifts caseload to remaining judges.",
          },
          {
            factor: "Adjournments",
            stat: "~11",
            statLabel: "avg adjournments per case",
            body: "DAKSH India found that across sampled district courts, cases averaged 11 hearing dates before disposal. Most hearings end in a postponement — for non-appearance, missing documents, counsel unavailability, or court overload. Each adjournment adds months.",
          },
          {
            factor: "Low digitalization",
            stat: "~15%",
            statLabel: "of courts with e-filing",
            body: "Physical cause lists, handwritten registers, and postal hearing notices mean courts cannot pre-schedule efficiently, parties miss hearings, and records cannot be searched or shared across courts. eCourts phase III is rolling out CMS but adoption is uneven.",
          },
          {
            factor: "Infrastructure gap",
            stat: "21,000+",
            statLabel: "courtrooms needed",
            body: "The Department of Justice estimates India needs over 21,000 additional courtrooms to match the sanctioned judge strength. Many courts share space, limiting how many hearings can run concurrently.",
          },
          {
            factor: "Case age accumulation",
            stat: "1.7M",
            statLabel: "cases pending over 10 years",
            body: "Long-pending cases compound the problem: they clog the docket even as newer cases file, require reconstructing old records, and often involve witnesses who have moved, died, or forgotten relevant details.",
          },
          {
            factor: "Data fragmentation",
            stat: "25+",
            statLabel: "separate state CMS systems",
            body: "Each state high court and many district courts run separate Case Management Systems with incompatible schemas. No single national query can tell you the status of a case that crossed state boundaries or was transferred.",
          },
        ].map(({ factor, stat, statLabel, body }) => (
          <Card key={factor}>
            <div className="text-xs font-mono mb-2 uppercase tracking-wider" style={{ color: "var(--docket-accent)" }}>
              {factor}
            </div>
            <div className="text-2xl font-bold font-mono mb-0.5" style={{ color: "var(--docket-text)" }}>
              {stat}
            </div>
            <div className="text-xs mb-3" style={{ color: "var(--docket-muted)" }}>
              {statLabel}
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "var(--docket-muted)" }}>
              {body}
            </p>
          </Card>
        ))}
      </div>

      <Details summary="Scoring methodology">
        <p className="mb-2">
          Each factor is scored 0–100 based on the worst observed value in the dataset being 100
          and the best being 0, then each state's raw value is linearly interpolated.
        </p>
        <ul className="list-disc list-inside space-y-1 mb-2">
          <li><strong>Vacancy score</strong>: % of sanctioned judge posts that are vacant (district + sessions courts per state high court jurisdiction).</li>
          <li><strong>Digital score</strong>: inverse of digitalization index — lower digital adoption = higher score. Based on eCourts project reports and state-level e-filing data.</li>
          <li><strong>Adjournment score</strong>: estimated average adjournments per disposed case, normalised. Based on DAKSH sampled court data extrapolated by state.</li>
          <li><strong>Pendency score</strong>: average age of pending cases in years, normalised.</li>
          <li><strong>Infrastructure score</strong>: deficit of courtrooms relative to sanctioned judge strength, per million population.</li>
        </ul>
        <p className="mb-2">
          <strong>Composite BSI</strong> = 0.20 × vacancy + 0.25 × digital + 0.25 × adjournment + 0.20 × pendency + 0.10 × infrastructure.
        </p>
        <p>
          Weights reflect the relative tractability of each factor for policy intervention. Digital gap and adjournments are upweighted because they are most directly addressable by data infrastructure reforms — the focus of this subproject.
        </p>
      </Details>
    </Section>
  );
}
